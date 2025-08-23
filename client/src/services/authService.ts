import api from '@/lib/axios';
import type { LoginPayload, RegisterPayload, AuthResponse } from '@/types/auth';

export const authService = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
};
