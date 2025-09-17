/**
 * Node modules
 */
import { AnimatePresence } from 'framer-motion';

/**
 * Hooks
 */
import { useTasksQuery } from '@/hooks/useTasks';

/**
 * Components
 */
import { TaskItem } from '@/components/TaskItem';
import { PageHelmet } from '@/components/PageHelmet';
import { TaskCardSkeleton } from '@/components/TaskCard';
import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';

const UpcomingPage = () => {
  const { tasks, isLoading } = useTasksQuery('upcoming');

  return (
    <>
      <PageHelmet title='Upcoming' />
      <Page>
        <PageHeader>
          <PageTitle>Upcoming</PageTitle>
        </PageHeader>
        <PageList>
          <AnimatePresence>
            {isLoading &&
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
          {!isLoading && tasks?.length === 0 && (
            <p className='text-muted-foreground text-center text-sm'>
              No upcoming tasks.
            </p>
          )}
        </PageList>
      </Page>
    </>
  );
};

export default UpcomingPage;
