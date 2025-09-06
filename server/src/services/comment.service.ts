/**
 * Node modules
 */
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

    return prisma.comment.findMany({
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

    let fileUrl: string | undefined;
    let commentType: CommentType = CommentType.TEXT;

    if (file) {
      const filePath = `${userId}/${taskId}/${Date.now()}-${file.originalname}`;

      const { error } = await supabase.storage
        .from(config.SUPABASE_BUCKET_NAME)
        .update(filePath, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) {
        throw new InternalServerError(
          `Supabase upload error: ${error.message}`,
          ERROR_CODE_ENUM.FILE_STORAGE_ERROR,
        );
      }

      const { data } = supabase.storage
        .from(config.SUPABASE_BUCKET_NAME)
        .getPublicUrl(filePath);

      fileUrl = data.publicUrl;
      commentType = CommentType.MEDIA;
    }

    if (!content && !fileUrl) {
      throw new BadRequestError('Comment must have content or a file.');
    }

    return prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
        fileUrl,
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
    await checkCommentOwnership(commentId, userId);

    return prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  },
};
