import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';
import type { CreateTaskPayload, Task, UpdateTaskPayload } from '@/types/task';

export const taskService = {
  createTask: async (
    payload: CreateTaskPayload,
  ): Promise<ApiResponse<{ task: Task }>> => {
    const { data } = await api.post('/tasks', payload);
    return data;
  },

  getTasks: async (
    filter?: string,
  ): Promise<ApiResponse<{ tasks: Task[] }>> => {
    const { data } = await api.get('/tasks', {
      params: filter ? { filter } : {},
    });
    return data;
  },

  updateTask: async (
    taskId: string,
    payload: UpdateTaskPayload,
  ): Promise<ApiResponse<{ updatedTask: Task }>> => {
    const { data } = await api.patch(`/tasks/${taskId}`, payload);
    return data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },
};
