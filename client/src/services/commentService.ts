/**
 * Libs
 */
import api from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type { Comment, CreateCommentPayload } from '@/types/comment';

export const commentService = {
  getComments: async (
    taskId: string,
  ): Promise<ApiResponse<{ comments: Comment[] }>> => {
    const { data } = await api.get(`/tasks/${taskId}/comments`);
    return data;
  },

  createComment: async (
    taskId: string,
    payload: CreateCommentPayload,
  ): Promise<ApiResponse<{ comment: Comment }>> => {
    const { data } = await api.post(`/tasks/${taskId}/comments`, payload);
    return data;
  },
};
