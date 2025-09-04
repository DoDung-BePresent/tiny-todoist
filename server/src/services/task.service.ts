import { CreateTaskPayload, UpdateTaskPayload } from '@/types/task.types';
import { NotFoundError } from '@/lib/error';
import prisma from '@/lib/prisma';
import { endOfDay, startOfDay } from 'date-fns';
import { projectService } from './project.service';

export const taskService = {
  createTask: async (userId: string, data: CreateTaskPayload) => {
    if (data.projectId) {
      await projectService.getProjectById(data.projectId, userId);
    }

    if (data.parentId) {
      await taskService.getTaskById(data.parentId, userId);
    }

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

    if (filter?.startsWith('project_')) {
      const projectId = filter.split('_')[1];

      await projectService.getProjectById(projectId, userId);

      return prisma.task.findMany({
        where: {
          userId,
          projectId,
          completed: false,
        },
        orderBy,
      });
    }

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
            projectId: null,
            parentId: null,
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
  getTaskStats: async (userId: string) => {
    const todayCondition = {
      userId,
      completed: false,
      dueDate: {
        gte: startOfDay(new Date()),
        lte: endOfDay(new Date()),
      },
    };

    const upcomingCondition = {
      userId,
      completed: false,
      dueDate: {
        gt: endOfDay(new Date()),
      },
    };

    const inboxCondition = {
      userId,
      completed: false,
      projectId: null,
    };

    const completedCondition = {
      userId,
      completed: true,
    };

    const [todayCount, upcomingCount, inboxCount, completedCount] =
      await Promise.all([
        prisma.task.count({ where: todayCondition }),
        prisma.task.count({ where: upcomingCondition }),
        prisma.task.count({ where: inboxCondition }),
        prisma.task.count({ where: completedCondition }),
      ]);

    return {
      today: todayCount,
      upcoming: upcomingCount,
      inbox: inboxCount,
      completed: completedCount,
    };
  },
  updateTask: async (
    taskId: string,
    userId: string,
    data: UpdateTaskPayload,
  ) => {
    await taskService.getTaskById(taskId, userId);

    if (data.projectId) {
      await projectService.getProjectById(data.projectId, userId);
    }

    if (data.parentId) {
      await taskService.getTaskById(data.parentId, userId);
    }

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

    return await prisma.task.delete({
      where: {
        id: taskId,
      },
    });
  },
};
