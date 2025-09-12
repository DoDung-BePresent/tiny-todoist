/**
 * Node modules
 */
import { toast } from 'sonner';
import { useNavigate } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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
import { useEffect } from 'react';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setAuth, clearAuth, user, accessToken } = useAuthStore();

  const {
    data: profileData,
    isSuccess,
    isError,
    isLoading: isAuthLoading,
  } = useQuery({
    queryKey: ['me'],
    queryFn: authService.getProfile,
    enabled: !!accessToken,
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (isSuccess && profileData && accessToken) {
      setAuth({ user: profileData.data.user, accessToken });
    }
  }, [isSuccess, profileData, accessToken, setAuth]);

  useEffect(() => {
    if (isError) {
      clearAuth();
      queryClient.clear();
    }
  }, [isError, clearAuth, queryClient]);

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
      queryClient.clear();
      toast.success('Logged out successfully');
      navigate('/login');
    }
  };

  return {
    user,
    accessToken,
    isAuthLoading,
    login: loginMutation,
    register: registerMutation,
    loginWithGithub,
    logout,
  };
};
