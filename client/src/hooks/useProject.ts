import { extractErrorDetails } from '@/lib/error';
import { projectService } from '@/services/projectService';
import type {
  CreateProjectPayload,
  Project,
  UpdateProjectPayload,
} from '@/types/project';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useProjectsQuery = () => {
  const getProjectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  });

  return {
    projects: getProjectsQuery.data?.data.projects,
    isLoading: getProjectsQuery.isLoading,
    isError: getProjectsQuery.isError,
  };
};

export const useProjectMutation = () => {
  const queryClient = useQueryClient();

  const createProject = useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectService.createProject(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
    onError: (error) => {
      const { message } = extractErrorDetails(error);
      toast.error(message);
    },
  });

  const deleteProject = useMutation({
    mutationFn: (projectId: string) => projectService.deleteProject(projectId),
    onSuccess: () => {
      toast.success('Project deleted successfully!');
    },
    onMutate: async (projectId: string) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      const previousProjectsData = queryClient.getQueriesData<{
        data: { projects: Project[] };
      }>({ queryKey: ['projects'] });

      queryClient.setQueryData<{ data: { projects: Project[] } }>(
        ['projects'],
        (old) => {
          if (!old?.data?.projects) {
            return old;
          }
          return {
            ...old,
            data: {
              ...old.data,
              projects: old.data.projects.filter(
                (project) => project.id !== projectId,
              ),
            },
          };
        },
      );

      return { previousProjectsData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousProjectsData) {
        context.previousProjectsData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const { message } = extractErrorDetails(err);
      toast.error(message || 'Failed to delete project.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProject = useMutation({
    mutationFn: ({
      projectId,
      payload,
    }: {
      projectId: string;
      payload: UpdateProjectPayload;
    }) => projectService.updateProject(projectId, payload),
    onMutate: async ({ projectId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });

      const previousProjectsData = queryClient.getQueriesData<{
        data: { projects: Project[] };
      }>({ queryKey: ['projects'] });

      queryClient.setQueryData<{ data: { projects: Project[] } }>(
        ['projects'],
        (old) => {
          if (!old?.data?.projects) {
            return old;
          }
          return {
            ...old,
            data: {
              ...old.data,
              projects: old.data.projects.map((project) =>
                project.id === projectId ? { ...project, ...payload } : project,
              ),
            },
          };
        },
      );

      return { previousProjectsData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousProjectsData) {
        context.previousProjectsData.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      const { message } = extractErrorDetails(err);
      toast.error(message || 'Failed to update project.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    createProject,
    deleteProject,
    updateProject,
  };
};
