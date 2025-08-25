import { CreateTaskPayload, UpdateTaskPayload } from '@/types/task.types';
import { NotFoundError } from '@/lib/error';
import prisma from '@/lib/prisma';

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
  getTasksByUser: async (userId: string) => {
    const tasks = await prisma.task.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tasks;
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
