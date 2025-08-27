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
    onSuccess: (_data, variables) => {
      const { taskId, payload } = variables;
      if (payload.completed) {
        toast('Task completed', {
          id: 'complete-task-toast',
          action: {
            label: 'Undo',
            onClick: () =>
              updateTask.mutate({ taskId, payload: { completed: false } }),
          },
        });
      }
    },
    onMutate: async ({ taskId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasksData = queryClient.getQueriesData<{
        data: { tasks: Task[] };
      }>({ queryKey: ['tasks'] });

      queryClient.setQueriesData<{ data: { tasks: Task[] } }>(
        { queryKey: ['tasks'] },
        (old) => {
          if (!old?.data?.tasks) {
            return old;
          }

          return {
            ...old,
            data: {
              ...old.data,
              tasks: old.data.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !!payload.completed }
                  : task,
              ),
            },
          };
        },
      );

      return { previousTasksData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousTasksData) {
        context.previousTasksData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      console.log(err);
      const { message } = extractErrorDetails(err);
      toast.error(message || 'Failed to update task.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    createTask,
    updateTask,
  };
};
