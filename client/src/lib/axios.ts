/**
 * Node modules
 */
import axios, { type CreateAxiosDefaults } from 'axios';

/**
 * Configs
 */
import config from '@/config';

/**
 * Store
 */
import { useAuthStore } from '@/stores/auth';

const options: CreateAxiosDefaults = {
  baseURL: config.API_BASE_URL,
  withCredentials: true,
};

const api = axios.create(options);
const apiRefresh = axios.create(options);

api.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await apiRefresh.post('/auth/refresh-token');
        const { accessToken } = response.data.data;

        const existingUser = useAuthStore.getState().user;
        useAuthStore.getState().setAuth({ accessToken, user: existingUser });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
