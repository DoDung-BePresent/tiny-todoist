/**
 * Node modules
 */
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
import { toast } from 'sonner';
import { extractErrorDetails } from '@/lib/error';

export const useAuth = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (response) => {
      setAuth(response.data);
      navigate('/app/today');
    },
    onError: (error) => {
      const { message, errorCode } = extractErrorDetails(error);

      toast.error(message);

      console.error('Login failed:', {
        message,
        errorCode,
        originalError: error,
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: (response) => {
      setAuth(response.data);
      navigate('/app/today');
    },
    onError: (error) => {
      const { message, errorCode } = extractErrorDetails(error);
      toast.error(message);

      console.error('Registration failed:', {
        message,
        errorCode,
        originalError: error,
      });
    },
  });

  return {
    login: loginMutation,
    register: registerMutation,
  };
};
