/**
 * Libs
 */
import logger from '@/lib/logger';
import prisma from '@/lib/prisma';

/**
 * Seeds
 */
import { getSampleData } from '@/seeds/sample-data';

export const seedService = {
  seedInitialDataForUser: async (userId: string) => {
    try {
      const sampleData = getSampleData();

      await prisma.$transaction(async (tx) => {
        const project = await tx.project.create({
          data: {
            ...sampleData.project,
            userId,
          },
        });

        await tx.task.createMany({
          data: sampleData.projectTasks.map((task) => ({
            ...task,
            projectId: project.id,
            userId,
          })),
        });

        await tx.task.createMany({
          data: sampleData.inboxTasks.map((task) => ({
            ...task,
            userId,
          })),
        });

        const parentTask = await tx.task.create({
          data: {
            ...sampleData.todayTaskWithSubtasks.parent,
            userId,
          },
        });

        await tx.task.createMany({
          data: sampleData.todayTaskWithSubtasks.subtasks.map((subtask) => ({
            ...subtask,
            parentId: parentTask.id,
            userId,
          })),
        });
      });
      logger.info(`Successfully seeded initial data for user ${userId}`);
    } catch (error) {
      logger.error(`Failed to seed initial data for user ${userId}:`, error);
    }
  },
};
