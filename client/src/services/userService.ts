/**
 * Libs
 */
import api from '@/lib/axios';

/**
 * Types
 */
import type { User } from '@/types/auth';
import type { ApiResponse } from '@/types/api';

export const userService = {
  updateProfile: async (
    payload: FormData,
  ): Promise<ApiResponse<{ user: User }>> => {
    const { data } = await api.patch('/users/me', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  updatePassword: async (payload: {
    currentPassword?: string;
    newPassword?: string;
  }): Promise<void> => {
    await api.patch('/users/me/password', payload);
  },
};
