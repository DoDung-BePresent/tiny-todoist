/**
 * Node modules
 */
import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

/**
 * Hooks
 */
import { useTasksQuery } from '@/hooks/useTasks';

/**
 * Components
 */
import { TaskForm } from '@/components/TaskForm';
import { TaskItem } from '@/components/TaskItem';
import { TaskCardSkeleton } from '@/components/TaskCard';
import { Page, PageHeader, PageList, PageTitle } from '@/components/Page';

const TodayPage = () => {
  const { tasks, isLoading } = useTasksQuery('today');
  const [showTaskForm, setShowTaskForm] = useState(false);
  return (
    <Page>
      <PageHeader>
        <PageTitle>Today</PageTitle>
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
        {tasks && !showTaskForm && tasks?.length > 0 && (
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
            className='mt-2'
            initialValues={{
              dueDate: new Date(),
            }}
            onDone={() => setShowTaskForm(false)}
          />
        )}
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
