/**
 * Services
 */
import { taskService } from '@/services/task.service';

/**
 * Libs
 */
import prisma from '@/lib/prisma';
import { ForbiddenError, NotFoundError } from '@/lib/error';

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

  createComment: async (taskId: string, userId: string, content: string) => {
    await taskService.getTaskById(taskId, userId);

    return prisma.comment.create({
      data: {
        content,
        taskId,
        userId,
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
