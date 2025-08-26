import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { toast } from 'sonner';
import { extractErrorDetails } from '@/lib/error';
import type { CreateTaskPayload } from '@/types/task';

export const useTasksQuery = () => {
  const getTasksQuery = useQuery({
    queryKey: ['tasks'],
    queryFn: () => taskService.getTasks(),
  });

  return {
    tasks: getTasksQuery.data?.data.tasks,
    isLoading: getTasksQuery.isLoading,
    isError: getTasksQuery.isError,
  };
};

export const useTaskMutations = () => {
  const queryClient = useQueryClient();

  const createTask = useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskService.createTask(payload),
    onSuccess: () => {
      toast.success('Task created successfully!');
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      const { message } = extractErrorDetails(error);
      toast.error(message);
    },
  });

  return {
    createTask,
  };
};
