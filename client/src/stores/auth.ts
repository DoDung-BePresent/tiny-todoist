import { create } from 'zustand';
import type { User } from '@/types/auth';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
};
type AuthActions = {
  setAuth: (data: { user: User | null; accessToken: string | null }) => void;
  clearAuth: () => void;
  setInitialized: (isInitialized: boolean) => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,
  setAuth: (data) =>
    set({
      user: data.user,
      accessToken: data.accessToken,
      isAuthenticated: !!data.accessToken && !!data.user,
    }),
  clearAuth: () =>
    set({ user: null, accessToken: null, isAuthenticated: false }),
  setInitialized: (isInitialized) => set({ isInitialized }),
}));
