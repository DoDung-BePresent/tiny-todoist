/**
 * Node modules
 */
import ms from 'ms';
import sharp from 'sharp';
import { CommentType } from '@prisma/client';

/**
 * Configs
 */
import config from '@/config/env.config';

/**
 * Constants
 */
import { ERROR_CODE_ENUM } from '@/constants/error.constant';

/**
 * Services
 */
import { taskService } from '@/services/task.service';

/**
 * Libs
 */
import prisma from '@/lib/prisma';
import { supabase } from '@/lib/supabase';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
} from '@/lib/error';
import logger from '@/lib/logger';

const checkCommentOwnership = async (commentId: string, userId: string) => {
  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!comment) {
    throw new NotFoundError('Comment not found!');
  }

  if (comment.userId !== userId) {
    throw new ForbiddenError(
      'You do not have permission to access this comment!',
    );
  }

  return comment;
};

export const commentService = {
  getCommentsByTask: async (taskId: string, userId: string) => {
    await taskService.getTaskById(taskId, userId);

    const comments = await prisma.comment.findMany({
      where: { taskId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        reactions: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const commentsWithSignedUrls = await Promise.all(
      comments.map(async (comment) => {
        if (comment.fileUrl) {
          const { data, error } = await supabase.storage
            .from(config.SUPABASE_BUCKET_NAME)
            .createSignedUrl(
              comment.fileUrl,
              ms(config.SIGNED_URL_EXPIRY) / 1000,
            );
          if (error) {
            logger.error('Error creating signed URL', { error });
            comment.fileUrl = null; // Prevent sending a broken path to the client
          } else {
            comment.fileUrl = data.signedUrl;
          }
        }
        return comment;
      }),
    );

    return commentsWithSignedUrls;
  },

  createComment: async (
    taskId: string,
    userId: string,
    payload: {
      content?: string;
      file?: Express.Multer.File;
    },
  ) => {
    await taskService.getTaskById(taskId, userId);

    const { content, file } = payload;

    let filePath: string | undefined;
    let commentType: CommentType = CommentType.TEXT;

    if (file) {
      filePath = `${userId}/${taskId}/${Date.now()}-${file.originalname}`;

      const optimizedBuffer = await sharp(file.buffer)
        .resize({
          width: 1024,
          withoutEnlargement: true,
        })
        .webp({ quality: 80 })
        .toBuffer();

      const { error } = await supabase.storage
        .from(config.SUPABASE_BUCKET_NAME)
        .update(filePath, optimizedBuffer, {
          contentType: 'image/webp',
        });

      if (error) {
        throw new InternalServerError(
          `Supabase upload error: ${error.message}`,
          ERROR_CODE_ENUM.FILE_STORAGE_ERROR,
        );
      }
      commentType = CommentType.MEDIA;
    }

    if (!content && !filePath) {
      throw new BadRequestError('Comment must have content or a file.');
    }

    return prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
        // TODO: Should renamed fileUrl to filePath
        fileUrl: filePath,
        fileName: file?.originalname,
        fileType: file?.mimetype,
        type: commentType,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        reactions: true,
      },
    });
  },

  updateComment: async (
    commentId: string,
    userId: string,
    payload: {
      content?: string;
      removeFile?: 'true';
    },
    file?: Express.Multer.File,
  ) => {
    if (
      payload.content === undefined &&
      payload.removeFile === undefined &&
      !file
    ) {
      throw new BadRequestError('Update payload cannot be empty.');
    }

    const comment = await checkCommentOwnership(commentId, userId);

    const dataToUpdate: {
      content?: string;
      fileUrl?: string | null;
      fileName?: string | null;
      fileType?: string | null;
      type?: CommentType;
    } = {};

    if (payload.content !== undefined) {
      dataToUpdate.content = payload.content;
    }

    if (file) {
      if (comment.fileUrl) {
        const { error: deleteError } = await supabase.storage
          .from(config.SUPABASE_BUCKET_NAME)
          .remove([comment.fileUrl]);

        if (deleteError) {
          logger.error('Failed to delete old file on update', {
            path: comment.fileUrl,
            error: deleteError,
          });
        }
      }

      const newFilePath = `${userId}/${comment.taskId}/${Date.now()}-${
        file.originalname
      }`;
      const { error: uploadError } = await supabase.storage
        .from(config.SUPABASE_BUCKET_NAME)
        .upload(newFilePath, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        throw new InternalServerError(
          `Supabase upload error: ${uploadError.message}`,
        );
      }

      dataToUpdate.fileUrl = newFilePath;
      dataToUpdate.fileName = file.originalname;
      dataToUpdate.fileType = file.mimetype;
      dataToUpdate.type = CommentType.MEDIA;
    } else if (payload.removeFile === 'true' && comment.fileUrl) {
      const { error } = await supabase.storage
        .from(config.SUPABASE_BUCKET_NAME)
        .remove([comment.fileUrl]);
      if (error) {
        logger.error('Failed to delete file on update', {
          path: comment.fileUrl,
          error,
        });
      }
      dataToUpdate.fileUrl = null;
      dataToUpdate.fileName = null;
      dataToUpdate.fileType = null;
    }

    return prisma.comment.update({
      where: { id: commentId },
      data: dataToUpdate,
      include: {
        user: { select: { id: true, name: true, avatar: true } },
        reactions: true,
      },
    });
  },

  deleteComment: async (commentId: string, userId: string) => {
    const comment = await checkCommentOwnership(commentId, userId);

    if (comment.fileUrl) {
      const { error } = await supabase.storage
        .from(config.SUPABASE_BUCKET_NAME)
        .remove([comment.fileUrl]);

      if (error) {
        logger.error('Failed to delete file from storage', {
          path: comment.fileUrl,
          error,
        });
      }
    }

    return prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  },
};
