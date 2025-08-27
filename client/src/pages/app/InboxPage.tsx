import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';
import { TaskCard, TaskCardSkeleton } from '@/components/TaskCard';
import { useTasksQuery } from '@/hooks/useTasks';

const InboxPage = () => {
  const { tasks, isLoading } = useTasksQuery();
  return (
    <Page>
      <PageHeader>
        <PageTitle>Inbox</PageTitle>
      </PageHeader>
      <PageList>
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
      </PageList>
    </Page>
  );
};

export default InboxPage;
