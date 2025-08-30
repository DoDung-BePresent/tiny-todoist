import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from '@/types/project';

export const projectService = {
  createProject: async (
    payload: CreateProjectPayload,
  ): Promise<ApiResponse<{ project: Project }>> => {
    const { data } = await api.post('/projects', payload);
    return data;
  },
  getProjects: async (): Promise<ApiResponse<{ projects: Project[] }>> => {
    const { data } = await api.get('/projects');
    return data;
  },
  updateProject: async (
    projectId: string,
    payload: UpdateProjectPayload,
  ): Promise<ApiResponse<{ project: Project }>> => {
    const { data } = await api.patch(`/projects/${projectId}`, payload);
    return data;
  },
  deleteProject: async (projectId: string): Promise<void> => {
    await api.delete(`/projects/${projectId}`);
  },
};
