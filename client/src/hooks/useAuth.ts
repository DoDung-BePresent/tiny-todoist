/**
 * Node modules
 */
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useMutation } from '@tanstack/react-query';

/**
 * Services
 */
import { authService } from '@/services/authService';

/**
 * Types
 */
import type { LoginPayload, RegisterPayload } from '@/types/auth';

/**
 * Store
 */
import { useAuthStore } from '@/stores/auth';

/**
 * Lib
 */
import { extractErrorDetails } from '@/lib/error';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response) => {
      setAuth(response.data);
      navigate('/app/today');
    },
    onError: (error) => {
      const { message } = extractErrorDetails(error);

      toast.error(message);
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (response) => {
      setAuth(response.data);
      navigate('/app/today');
    },
    onError: (error) => {
      const { message } = extractErrorDetails(error);
      toast.error(message);
    },
  });

  const loginWithGithub = () => {
    try {
      authService.loginWithGithub();
    } catch (error) {
      toast.error('Failed to redirect to GitHub');
      console.error('GitHub login failed:', error);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearAuth();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return {
    login: loginMutation,
    register: registerMutation,
    loginWithGithub,
    logout,
  };
};
