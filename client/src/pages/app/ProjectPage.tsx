/**
 * Node modules
 */
import { useEffect, useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { Link, useParams } from 'react-router';
import { AnimatePresence } from 'framer-motion';

/**
 * Hooks
 */
import { useTasksQuery } from '@/hooks/useTasks';
import { useProjectQuery } from '@/hooks/useProject';

/**
 * Assets
 */
import projectNotFoundImage from '@/assets/project-not-found.png';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

/**
 * Components
 */
import { TaskCardSkeleton } from '@/components/TaskCard';
import {
  Page,
  PageHeader,
  PageList,
  PageSkeleton,
  PageTitle,
} from '@/components/Page';
import { Button } from '@/components/ui/button';
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';

const ProjectPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const projectId = id?.includes('-') ? id.split('-').pop() : id;

  const { project, isLoading: isLoadingProject } = useProjectQuery(projectId!);
  const { tasks, isLoading: isLoadingTasks } = useTasksQuery(
    projectId ? `project_${projectId}` : '',
  );

  useEffect(() => {
    setShowTaskForm(false);
  }, [projectId]);

  if (isLoadingTasks || isLoadingProject) {
    return <PageSkeleton />;
  }

  if (!project && !isLoadingProject) {
    return (
      <div className='h-screen w-full'>
        <div className='container mx-auto flex h-full items-center justify-center'>
          <div className='flex w-96 flex-col items-center gap-2 text-center'>
            <img
              src={projectNotFoundImage}
              className='h-64 w-64'
              alt=''
            />
            <h3 className='font-medium'>Project not found</h3>
            <p className='text-muted-foreground text-sm'>
              The project doesn't seem to exist or you don't have permission to
              access it.
            </p>
            <Button
              className='my-3'
              asChild
            >
              <Link
                to={'/app/today'}
                replace
              >
                Go back to home
              </Link>
            </Button>
            <p className='text-xs'>
              You're currently logged in as <strong>{user?.email}</strong>.
              Wrong account? Please{' '}
              <a
                href='#'
                className='underline'
              >
                log out
              </a>{' '}
              and back into an account with access.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Page>
      <PageHeader>
        <PageTitle>{project?.name}</PageTitle>
      </PageHeader>
      <PageList>
        <AnimatePresence>
          {isLoadingTasks &&
            Array.from({ length: 3 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          {tasks?.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
            />
          ))}
        </AnimatePresence>
        {tasks && !showTaskForm && (
          <button
            onClick={() => setShowTaskForm(true)}
            className='group/button hover:text-primary text-muted-foreground flex w-full cursor-pointer items-center gap-2 p-1.5 px-0.5 py-2.5 text-sm'
          >
            <PlusIcon
              className='text-primary group-hover/button:bg-primary size-5.5 rounded-full p-[1px] group-hover/button:text-white'
              strokeWidth={1.5}
            />
            Add task
          </button>
        )}
        {showTaskForm && (
          <TaskForm
            type='card'
            mode='create'
            initialValues={{
              projectId,
            }}
            className='mt-2'
            onDone={() => setShowTaskForm(false)}
          />
        )}
      </PageList>
    </Page>
  );
};

export default ProjectPage;
