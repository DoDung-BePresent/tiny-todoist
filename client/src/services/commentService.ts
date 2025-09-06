/**
 * Libs
 */
import api from '@/lib/axios';

/**
 * Types
 */
import type { ApiResponse } from '@/types/api';
import type {
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '@/types/comment';

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

  updateComment: async (
    taskId: string,
    commentId: string,
    payload: UpdateCommentPayload,
  ): Promise<ApiResponse<{ comment: Comment }>> => {
    const { data } = await api.patch(
      `/tasks/${taskId}/comments/${commentId}`,
      payload,
    );
    return data;
  },

  deleteComment: async (taskId: string, commentId: string): Promise<void> => {
    await api.delete(`/tasks/${taskId}/comments/${commentId}`);
  },
};
