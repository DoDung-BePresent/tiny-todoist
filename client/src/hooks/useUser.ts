/**
 * Node modules
 */
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Services
 */
import { userService } from '@/services/userService';

/**
 * Libs
 */
import { extractErrorDetails } from '@/lib/error';

/**
 * Types
 */
import type { UpdatePasswordPayload } from '@/types/user';

export const useUserMutations = () => {
  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: (payload: FormData) => userService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error) => {
      const { message } = extractErrorDetails(error);
      toast.error(message || 'Failed to update profile.');
    },
  });

  const updatePassword = useMutation({
    mutationFn: (payload: UpdatePasswordPayload) =>
      userService.updatePassword(payload),
    onSuccess: () => {
      toast.success('Password updated successfully!');
    },
    onError: (error) => {
      const { message } = extractErrorDetails(error);
      toast.error(message || 'Failed to update password.');
    },
  });

  return {
    updateProfile,
    updatePassword,
  };
};
