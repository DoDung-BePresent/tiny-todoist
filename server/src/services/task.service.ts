import { CreateTaskPayload, UpdateTaskPayload } from '@/types/task.types';
import { NotFoundError } from '@/lib/error';
import prisma from '@/lib/prisma';
import { endOfDay, startOfDay } from 'date-fns';

export const taskService = {
  createTask: async (userId: string, data: CreateTaskPayload) => {
    const task = await prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });
    return task;
  },
  getTasksByUser: async (userId: string, filter?: string) => {
    const orderBy = {
      createdAt: 'desc' as const,
    };

    switch (filter) {
      case 'today':
        return prisma.task.findMany({
          where: {
            userId,
            completed: false,
            dueDate: {
              gte: startOfDay(new Date()),
              lte: endOfDay(new Date()),
            },
          },
          orderBy,
        });
      case 'upcoming':
        return prisma.task.findMany({
          where: {
            userId,
            completed: false,
            dueDate: {
              gt: endOfDay(new Date()),
            },
          },
          orderBy,
        });
      case 'completed':
        return prisma.task.findMany({
          where: {
            userId,
            completed: true,
          },
          orderBy,
        });
      default:
        return prisma.task.findMany({
          where: {
            userId,
            completed: false,
          },
          orderBy,
        });
    }
  },
  getTaskById: async (taskId: string, userId: string) => {
    const task = await prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });

    if (!task || task.userId !== userId) {
      throw new NotFoundError('Task not found');
    }

    return task;
  },
  updateTask: async (
    taskId: string,
    userId: string,
    data: UpdateTaskPayload,
  ) => {
    await taskService.getTaskById(taskId, userId);

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data,
    });

    return updatedTask;
  },
  deleteTask: async (taskId: string, userId: string) => {
    await taskService.getTaskById(taskId, userId);

    await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  },
};
