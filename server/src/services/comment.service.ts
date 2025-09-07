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
import { ERROR_CODE_ENUM } from '@/constants/error.constant';
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
            .createSignedUrl(comment.fileUrl, ms(config.SIGNED_URL_EXPIRY));
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

  updateComment: async (commentId: string, userId: string, content: string) => {
    await checkCommentOwnership(commentId, userId);

    return prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
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
