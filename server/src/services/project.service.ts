import { NotFoundError } from '@/lib/error';
import prisma from '@/lib/prisma';
import {
  CreateProjectPayload,
  UpdateProjectPayload,
} from '@/types/project.types';

export const projectService = {
  // TODO: title must be less than 120 characters
  createProject: async (userId: string, data: CreateProjectPayload) => {
    const project = await prisma.project.create({
      data: {
        ...data,
        userId,
      },
    });
    return project;
  },
  getProjectsByUser: async (userId: string) => {
    const projects = await prisma.project.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return projects;
  },
  getProjectById: async (projectId: string, userId: string) => {
    const project = await prisma.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project || project.userId !== userId) {
      throw new NotFoundError('Project not found');
    }
    return project;
  },
  updateProject: async (
    projectId: string,
    userId: string,
    data: UpdateProjectPayload,
  ) => {
    await projectService.getProjectById(projectId, userId);
    const updatedProject = await prisma.project.update({
      where: {
        id: projectId,
      },
      data,
    });

    return updatedProject;
  },

  deleteProject: async (projectId: string, userId: string) => {
    await projectService.getProjectById(projectId, userId);

    return await prisma.project.delete({
      where: {
        id: projectId,
      },
    });
  },
};
