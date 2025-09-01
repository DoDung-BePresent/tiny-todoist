/**
 * Node modules
 */
import { Link, useParams } from 'react-router';
import { AnimatePresence } from 'framer-motion';

/**
 * Hooks
 */
import { useTasksQuery } from '@/hooks/useTasks';

/**
 * Assets
 */
import projectNotFoundImage from '@/assets/project-not-found.png';

/**
 * Components
 */
import { TaskCard, TaskCardSkeleton } from '@/components/TaskCard';
import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const ProjectPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { tasks, isLoading } = useTasksQuery(id);
  const title = id?.split('-')[0];

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!tasks && !isLoading) {
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
        <PageTitle>{title}</PageTitle>
      </PageHeader>
      <PageList>
        <AnimatePresence>
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
            />
          ))}
        </AnimatePresence>
      </PageList>
    </Page>
  );
};

export default ProjectPage;
