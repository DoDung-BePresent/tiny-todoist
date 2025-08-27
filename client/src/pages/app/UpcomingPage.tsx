import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';
import { TaskCard, TaskCardSkeleton } from '@/components/TaskCard';
import { useTasksQuery } from '@/hooks/useTasks';
import { AnimatePresence } from 'framer-motion';

const UpcomingPage = () => {
  const { tasks, isLoading } = useTasksQuery('upcoming');

  return (
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
            <TaskCard
              key={task.id}
              id={task.id}
              title={task.title}
              description={task.description}
              completed={task.completed}
              dueDate={task.dueDate}
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
  );
};

export default UpcomingPage;
