/**
 * Services
 */
import { taskService } from '@/services/task.service';

/**
 * Libs
 */
import prisma from '@/lib/prisma';

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
};
