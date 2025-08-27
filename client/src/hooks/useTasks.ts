import type { Task, UpdateTaskPayload } from '@/types/task';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { taskService } from '@/services/taskService';
import { toast } from 'sonner';
import { extractErrorDetails } from '@/lib/error';
import type { CreateTaskPayload } from '@/types/task';

export const useTasksQuery = (filter?: string) => {
  const getTasksQuery = useQuery({
    queryKey: ['tasks', filter || 'inbox'],
    queryFn: () => taskService.getTasks(filter),
  });

  return {
    tasks: getTasksQuery.data?.data.tasks,
    isLoading: getTasksQuery.isLoading,
    isError: getTasksQuery.isError,
  };
};

export const useTaskStatsQuery = () => {
  const query = useQuery({
    queryKey: ['tasks', 'stats'],
    queryFn: taskService.getTaskStats,
    staleTime: 1000 * 60 * 5,
  });

  return {
    stats: query.data?.data,
    isLoading: query.isLoading,
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

  const updateTask = useMutation({
    mutationFn: ({
      taskId,
      payload,
    }: {
      taskId: string;
      payload: UpdateTaskPayload;
    }) => taskService.updateTask(taskId, payload),
    onMutate: async ({ taskId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData<{
        data: { tasks: Task[] };
      }>(['tasks']);
      queryClient.setQueryData<{ data: { tasks: Task[] } }>(
        ['tasks'],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: {
              ...old.data,
              tasks: old.data.tasks.map((task) =>
                task.id === taskId
                  ? ({
                      ...task,
                      ...payload,
                      dueDate: payload.dueDate
                        ? payload.dueDate.toISOString()
                        : task.dueDate,
                    } as Task)
                  : task,
              ),
            },
          };
        },
      );

      return { previousTasks };
    },
    onError: (err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      const { message } = extractErrorDetails(err);
      toast.error(message || 'Failed to update task.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', 'stats'] });
    },
  });

  return {
    createTask,
    updateTask,
  };
};
