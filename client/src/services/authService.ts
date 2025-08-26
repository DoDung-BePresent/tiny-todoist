/**
 * Libs
 */
import api from '@/lib/axios';
import type { ApiResponse } from '@/types/api';

/**
 * Types
 */
import type { AuthResponseData, LoginPayload, RegisterPayload} from '@/types/auth';

export const authService = {
  register: async (payload: RegisterPayload): Promise<ApiResponse<AuthResponseData>> => {
    const { data } = await api.post('/auth/register', payload);
    return data;
  },
  login: async (payload: LoginPayload): Promise<ApiResponse<AuthResponseData>> => {
    const { data } = await api.post('/auth/login', payload);
    return data;
  },
  // refreshToken: async (): Promise<{ data: { accessToken: string } }> => {
  //   const { data } = await api.post('/auth/refresh-token');
  //   return data;
  // },
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
  loginWithGithub: () => {
    window.location.href = `${api.defaults.baseURL}/auth/github`;
  },
  handleGithubCallback: async (code: string): Promise<ApiResponse<AuthResponseData>> => {
    const { data } = await api.get(`/api/github/callback?code=${code}`);
    return data;
  },
  getProfile: async (): Promise<ApiResponse<AuthResponseData>> => {
    const { data } = await api.get('/users/me');
    return data;
  },
};
