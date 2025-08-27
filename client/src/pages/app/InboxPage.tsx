import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';
import { TaskCard, TaskCardSkeleton } from '@/components/TaskCard';
import { useTasksQuery } from '@/hooks/useTasks';
import { AnimatePresence } from 'framer-motion';

const InboxPage = () => {
  const { tasks, isLoading } = useTasksQuery();
  return (
    <Page>
      <PageHeader>
        <PageTitle>Inbox</PageTitle>
      </PageHeader>
      <PageList>
        <AnimatePresence>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          {tasks?.map(({ id, title, description, completed, dueDate }) => (
            <TaskCard
              key={id}
              id={id}
              title={title}
              description={description}
              completed={completed}
              dueDate={dueDate}
            />
          ))}
        </AnimatePresence>
        {!isLoading && tasks?.length === 0 && (
          <p className='text-muted-foreground text-center text-sm'>
            No inbox tasks.
          </p>
        )}
      </PageList>
    </Page>
  );
};

export default InboxPage;
