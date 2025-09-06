/**
 * Node modules
 */
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Libs
 */
import { extractErrorDetails } from '@/lib/error';

/**
 * Types
 */
import type {
  Comment,
  CreateCommentPayload,
  UpdateCommentPayload,
} from '@/types/comment';

/**
 * Services
 */
import { commentService } from '@/services/commentService';

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

  const updateComment = useMutation({
    mutationFn: ({
      commentId,
      payload,
    }: {
      commentId: string;
      payload: UpdateCommentPayload;
    }) => commentService.updateComment(taskId, commentId, payload),
    onMutate: async ({ commentId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['comments', taskId] });

      const previousComments = queryClient.getQueryData<{
        data: { comments: Comment[] };
      }>(['comments', taskId]);

      queryClient.setQueryData<{ data: { comments: Comment[] } }>(
        ['comments', taskId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              comments: old.data.comments.map((comment) =>
                comment.id === commentId ? { ...comment, ...payload } : comment,
              ),
            },
          };
        },
      );

      return { previousComments };
    },
    onError: (err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', taskId],
          context.previousComments,
        );
      }
      const { message } = extractErrorDetails(err);
      toast.error(message || 'Failed to update comment.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });

  const deleteComment = useMutation({
    mutationFn: (commentId: string) =>
      commentService.deleteComment(taskId, commentId),
    onSuccess: () => {
      toast.success('Comment deleted successfully!');
    },
    onMutate: async (commentId: string) => {
      await queryClient.cancelQueries({ queryKey: ['comments', taskId] });

      const previousComments = queryClient.getQueryData<{
        data: { comments: Comment[] };
      }>(['comments', taskId]);

      queryClient.setQueryData<{ data: { comments: Comment[] } }>(
        ['comments', taskId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              comments: old.data.comments.filter(
                (comment) => comment.id !== commentId,
              ),
            },
          };
        },
      );

      return { previousComments };
    },
    onError: (err, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ['comments', taskId],
          context.previousComments,
        );
      }
      const { message } = extractErrorDetails(err);
      toast.error(message || 'Failed to delete comment.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
    },
  });

  return {
    createComment,
    updateComment,
    deleteComment,
  };
};
