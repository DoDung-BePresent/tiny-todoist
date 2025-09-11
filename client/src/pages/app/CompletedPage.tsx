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
import { TaskCardSkeleton } from '@/components/TaskCard';
import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';

const CompletedPage = () => {
  const { tasks, isLoading } = useTasksQuery('completed');

  return (
    <Page>
      <PageHeader>
        <PageTitle>Completed</PageTitle>
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
            No completed tasks.
          </p>
        )}
      </PageList>
    </Page>
  );
};

export default CompletedPage;
