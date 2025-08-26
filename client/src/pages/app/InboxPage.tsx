import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';
import { TaskCard } from '@/components/TaskCard';
import { useTasksQuery } from '@/hooks/useTasks';

const InboxPage = () => {
  const { tasks } = useTasksQuery();
  return (
    <Page>
      <PageHeader>
        <PageTitle>Inbox</PageTitle>
      </PageHeader>
      <PageList>
        {tasks?.map(({ id, title, description, completed }) => (
          <TaskCard
            key={id}
            id={id}
            title={title}
            description={description}
            completed={completed}
          />
        ))}
      </PageList>
    </Page>
  );
};

export default InboxPage;
