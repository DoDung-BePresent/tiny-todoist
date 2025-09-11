/**
 * Node modules
 */
import { useState } from 'react';
import {
  CalendarIcon,
  CheckIcon,
  CircleIcon,
  GitMergeIcon,
  MessageSquareIcon,
  PenLineIcon,
  TrashIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Libs
 */
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/sound';
import { formatCustomDate, getTaskDueDateColorClass } from '@/lib/date';

/**
 * Types
 */
import type { Priority, Task } from '@/types/task';

/**
 * Hooks
 */
import { useTaskMutations } from '@/hooks/useTasks';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { TaskForm } from '@/components/TaskForm';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { TaskDetailDialog } from '@/components/TaskDetailDialog';

type TaskCardClassNames = {
  checkButton?: string;
};

type TaskCardProps = {
  task: Task;
  onOpenForm?: () => void;
  onCloseForm?: () => void;
  classNames?: TaskCardClassNames;
};

export const TaskCard = ({
  task,
  classNames,
  onCloseForm,
  onOpenForm,
}: TaskCardProps) => {
  const { id, title, description, completed, dueDate, priority, _count } = task;

  const { updateTask, deleteTask } = useTaskMutations();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

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
        mode='edit'
        task={task}
        onDone={() => {
          setShowTaskForm(false);
          onCloseForm?.();
        }}
        className='mt-2'
      />
    );
  }

  return (
    <>
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
        <div className='group/card flex cursor-pointer items-start gap-2 py-2'>
          <CheckButton
            priority={priority}
            completed={completed}
            onToggle={handleToggleComplete}
            className={cn('mt-1', classNames?.checkButton)}
          />
          <div
            className='w-[90%]'
            onClick={() => setShowTaskDetail(true)}
          >
            <span
              className={cn(
                'truncate text-sm',
                completed && 'text-muted-foreground line-through',
              )}
            >
              {title}
            </span>
            <p className='text-muted-foreground truncate text-xs'>
              {description}
            </p>
            <div className='mt-1 flex items-center gap-2'>
              {_count && _count.subtasks > 0 && (
                <div className='text-muted-foreground flex items-center gap-1'>
                  <GitMergeIcon className='size-3' />
                  <span className='text-xs'>{_count.subtasks}</span>
                </div>
              )}
              {dueDate && (
                <div
                  className={cn(
                    'text-muted-foreground flex items-center gap-1',
                    getTaskDueDateColorClass(new Date(dueDate), completed),
                  )}
                >
                  <CalendarIcon className='size-3' />
                  <span className='text-xs'>{formatCustomDate(dueDate)}</span>
                </div>
              )}
              {_count && _count.comments > 0 && (
                <div className='text-muted-foreground flex items-center gap-1'>
                  <MessageSquareIcon className='size-3' />
                  <span className='text-xs'>{_count.comments}</span>
                </div>
              )}
            </div>
          </div>
          <div className='flex items-center gap-1'>
            <Button
              onClick={() => {
                setShowTaskForm(true);
                onOpenForm?.();
              }}
              variant={'ghost'}
              className='size-7 rounded-sm text-blue-500 opacity-0 duration-100 ease-in-out group-hover/card:opacity-100 hover:text-blue-500'
            >
              <PenLineIcon className='size-4' />
            </Button>

            <Button
              variant={'ghost'}
              onClick={() => setShowConfirm(true)}
              className='size-7 rounded-sm text-red-500 opacity-0 duration-100 ease-in-out group-hover/card:opacity-100 hover:text-red-500'
            >
              <TrashIcon className='size-4' />
            </Button>
          </div>
        </div>
      </motion.div>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title='Delete Task?'
        description={
          <p>
            The <span className='font-medium text-black'>{title}</span> task
            will be permanently deleted.
          </p>
        }
        onConfirm={handleDelete}
        className='top-[20%]'
        okLabel='Delete'
      />
      <TaskDetailDialog
        open={showTaskDetail}
        onOpenChange={setShowTaskDetail}
        task={task}
      />
    </>
  );
};

const circleVariants = {
  rest: { scale: 1 },
  tapped: { scale: 1.2 },
};

export const CheckButton = ({
  completed,
  onToggle,
  className,
  priority,
}: {
  completed: boolean;
  onToggle: () => void;
  className?: string;
  priority: Priority;
}) => {
  return (
    <motion.button
      type='button'
      initial='rest'
      whileTap='tapped'
      className={cn('relative cursor-pointer', className)}
      onClick={onToggle}
    >
      <motion.div variants={circleVariants}>
        <CircleIcon
          className={cn('size-5 rounded-full stroke-1 text-[#999999]', {
            'bg-red-50 stroke-2 text-red-500': priority === 'P1',
            'bg-amber-50 stroke-2 text-amber-500': priority === 'P2',
            'bg-blue-50 stroke-2 text-blue-500': priority === 'P3',
          })}
          // color='#999'
        />
      </motion.div>
      <CheckIcon
        className={cn(
          'absolute top-1/2 left-1/2 size-[11px] -translate-x-1/2 -translate-y-1/2 text-[#999999] opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100',
          {
            'opacity-100': completed,
            'text-red-500': priority === 'P1',
            'text-amber-500': priority === 'P2',
            'text-blue-500': priority === 'P3',
          },
        )}
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
