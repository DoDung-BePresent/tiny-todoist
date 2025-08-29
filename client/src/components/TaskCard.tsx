import {
  CalendarIcon,
  CheckIcon,
  CircleIcon,
  PenLineIcon,
  TrashIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/task';
import { formatCustomDate, getTaskDueDateColorClass } from '@/lib/date';
import { Skeleton } from '@/components/ui/skeleton';
import { useTaskMutations } from '@/hooks/useTasks';
import { playSound } from '@/lib/sound';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { useState } from 'react';
import { TaskForm } from './TaskForm';

type TaskCardProps = Pick<
  Task,
  'id' | 'title' | 'description' | 'completed' | 'dueDate' | 'priority'
>;

export const TaskCard = ({
  id,
  title,
  description,
  completed,
  dueDate,
  priority,
}: TaskCardProps) => {
  const { updateTask, deleteTask } = useTaskMutations();
  const [showTaskForm, setShowTaskForm] = useState(false);

  const handleToggleComplete = () => {
    playSound('/complete-sound.mp3');
    updateTask.mutate({ taskId: id, payload: { completed: !completed } });
  };

  const handleDelete = () => {
    deleteTask.mutate(id);
  };

  if (showTaskForm) {
    return (
      <TaskForm
        type='card'
        id={id}
        mode='edit'
        defaultValues={{
          title,
          description: description ?? '',
          dueDate: dueDate ? new Date(dueDate) : undefined,
          priority,
        }}
        onDone={() => setShowTaskForm(false)}
        className='mt-2'
      />
    );
  }

  return (
    <motion.div
      // layout
      exit={{
        opacity: 0,
        height: 0,
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        transition: { duration: 0.3 },
      }}
      className='border-b'
    >
      <div className='group/card flex items-start gap-2 py-2'>
        <CheckButton
          completed={completed}
          onToggle={handleToggleComplete}
          className='mt-1'
        />
        <div className='w-[90%]'>
          <span className='truncate text-sm'>{title}</span>
          <p className='text-muted-foreground truncate text-xs'>
            {description}
          </p>
          {dueDate && (
            <div
              className={cn(
                'text-muted-foreground mt-1 flex items-center gap-1',
                getTaskDueDateColorClass(new Date(dueDate), completed),
              )}
            >
              <CalendarIcon className='size-3' />
              <span className='text-xs'>{formatCustomDate(dueDate)}</span>
            </div>
          )}
        </div>
        <div className='flex items-center gap-1'>
          <Button
            onClick={() => setShowTaskForm(true)}
            variant={'ghost'}
            className='size-7 rounded-sm text-blue-500 opacity-0 duration-100 ease-in-out group-hover/card:opacity-100 hover:text-blue-500'
          >
            <PenLineIcon className='size-4' />
          </Button>
          <ConfirmDialog
            title='Delete Task?'
            description={
              <p>
                The <span className='font-medium text-black'>{title}</span> task
                will be permanently deleted.
              </p>
            }
            onConfirm={handleDelete}
            className='top-[20%]'
          >
            <Button
              variant={'ghost'}
              className='size-7 rounded-sm text-red-500 opacity-0 duration-100 ease-in-out group-hover/card:opacity-100 hover:text-red-500'
            >
              <TrashIcon className='size-4' />
            </Button>
          </ConfirmDialog>
        </div>
      </div>
    </motion.div>
  );
};

const circleVariants = {
  rest: { scale: 1 },
  tapped: { scale: 1.2 },
};

const CheckButton = ({
  completed,
  onToggle,
  className,
}: {
  completed: boolean;
  onToggle: () => void;
  className?: string;
}) => {
  return (
    <motion.button
      initial='rest'
      whileTap='tapped'
      className={cn('relative cursor-pointer', className)}
      onClick={onToggle}
    >
      <motion.div variants={circleVariants}>
        <CircleIcon
          className='size-5 stroke-1'
          color='#999'
        />
      </motion.div>
      <CheckIcon
        className={cn(
          'absolute top-1/2 left-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100',
          {
            'opacity-100': completed,
          },
        )}
        color='#999'
        strokeWidth={3}
      />
    </motion.button>
  );
};

export const TaskCardSkeleton = () => {
  return (
    <div className='border-b'>
      <div className='my-2 flex items-start gap-2'>
        <Skeleton className='size-5 rounded-full' />
        <div className='w-full space-y-2 pr-16'>
          <Skeleton className='h-5 w-64' />
          <Skeleton className='h-3 w-96' />
          <Skeleton className='h-2 w-10' />
        </div>
      </div>
    </div>
  );
};
