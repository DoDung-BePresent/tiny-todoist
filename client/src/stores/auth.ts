import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/types/auth';

type AuthState = {
  user: User | null;
  accessToken: string | null;
};

type AuthActions = {
  setAuth: (data: { user: User; accessToken: string }) => void;
  clearAuth: () => void;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      ...initialState,
      setAuth: (data) =>
        set({ user: data.user, accessToken: data.accessToken }),
      clearAuth: () => set({ ...initialState }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
