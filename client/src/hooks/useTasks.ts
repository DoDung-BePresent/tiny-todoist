/**
 * Node modules
 */
import { toast } from 'sonner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * Services
 */
import { taskService } from '@/services/taskService';

/**
 * Libs
 */
import { extractErrorDetails } from '@/lib/error';

/**
 * Utils
 */
import { updateTaskInTree, findTaskById } from '@/utils/task';

/**
 * Types
 */
import type { CreateTaskPayload } from '@/types/task';
import type { Task, UpdateTaskPayload } from '@/types/task';

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

          const taskToUpdate = findTaskById(old.data.tasks, taskId);

          if (payload.completed && taskToUpdate && !taskToUpdate.parentId) {
            return {
              ...old,
              data: {
                ...old.data,
                tasks: old.data.tasks.filter((task) => task.id !== taskId),
              },
            };
          }

          return {
            ...old,
            data: {
              ...old.data,
              tasks: updateTaskInTree(old.data.tasks, taskId, payload),
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
      const { message } = extractErrorDetails(err);
      toast.error(message || 'Failed to update task.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTask = useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(taskId),
    onSuccess: () => {
      toast.success('Task deleted successfully!');
    },
    onMutate: async (taskId: string) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasksData = queryClient.getQueriesData<{
        data: { tasks: Task[] };
      }>({ queryKey: ['tasks'] });

      queryClient.setQueriesData<{ data: { tasks: Task[] } }>(
        {
          queryKey: ['tasks'],
        },
        (old) => {
          if (!old?.data?.tasks) {
            return old;
          }
          return {
            ...old,
            data: {
              ...old.data,
              tasks: old.data.tasks.filter((task) => task.id !== taskId),
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
      const { message } = extractErrorDetails(err);
      toast.error(message || 'Failed to delete task.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  return {
    createTask,
    updateTask,
    deleteTask,
  };
};
