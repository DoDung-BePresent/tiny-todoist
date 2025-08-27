import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';
import { TaskCard, TaskCardSkeleton } from '@/components/TaskCard';
import { useTasksQuery } from '@/hooks/useTasks';

const TodayPage = () => {
  const { tasks, isLoading } = useTasksQuery('today');

  return (
    <Page>
      <PageHeader>
        <PageTitle>Today</PageTitle>
      </PageHeader>
      <PageList>
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
        {!isLoading && tasks?.length === 0 && (
          <p className='text-muted-foreground text-center text-sm'>
            No tasks for today. Enjoy your day!
          </p>
        )}
      </PageList>
    </Page>
  );
};

export default TodayPage;
