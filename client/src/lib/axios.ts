/**
 * Node modules
 */
import axios from 'axios';

/**
 * Configs
 */
import config from '@/config';

/**
 * Store
 */
import { useAuthStore } from '@/stores/auth';

const api = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
});

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

export default api;
