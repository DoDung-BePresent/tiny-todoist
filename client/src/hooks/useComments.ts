import { extractErrorDetails } from '@/lib/error';
import { commentService } from '@/services/commentService';
import type { CreateCommentPayload, Comment } from '@/types/comment';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useCommentsQuery = (taskId: string) => {
  const query = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => commentService.getComments(taskId),
    enabled: !!taskId,
  });

  return {
    comments: query.data?.data.comments,
    isLoading: query.isLoading,
  };
};

export const useCommentMutations = (taskId: string) => {
  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: (payload: CreateCommentPayload) =>
      commentService.createComment(taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: (error) => {
      const { message } = extractErrorDetails(error);
      toast.error(message || 'Failed to add comment.');
    },
  });
  return {
    createComment,
  };
};
