import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';
import { TaskCard, TaskCardSkeleton } from '@/components/TaskCard';
import { useTasksQuery } from '@/hooks/useTasks';
import { AnimatePresence } from 'framer-motion';

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
            <TaskCard
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
