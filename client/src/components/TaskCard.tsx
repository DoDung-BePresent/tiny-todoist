import { CalendarIcon, CheckIcon, CircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/task';
import { formatCustomDate } from '@/lib/date';
import { Skeleton } from './ui/skeleton';
import { useTaskMutations } from '@/hooks/useTasks';
import { toast } from 'sonner';

type TaskCardProps = Pick<
  Task,
  'id' | 'title' | 'description' | 'completed' | 'dueDate'
>;

export const TaskCard = ({
  id,
  title,
  description,
  completed,
  dueDate,
}: TaskCardProps) => {
  const { updateTask } = useTaskMutations();

  const handleToggleComplete = () => {
    updateTask.mutate({ taskId: id, payload: { completed: !completed } });
  };

  return (
    <div className='border-b'>
      <div className='flex items-start gap-2 py-2'>
        <CheckButton
          completed={completed}
          onToggle={handleToggleComplete}
          className='mt-1'
        />
        <div className='w-full pr-16'>
          <span className='truncate text-sm'>{title}</span>
          <p className='text-muted-foreground truncate text-xs'>
            {description}
          </p>
          {dueDate && (
            <div className='text-muted-foreground mt-1 flex items-center gap-1'>
              <CalendarIcon className='size-3' />
              <span className='text-xs'>{formatCustomDate(dueDate)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
    <button
      className={cn('relative cursor-pointer', className)}
      onClick={onToggle}
    >
      <CircleIcon
        className='size-5 stroke-1'
        color='#999'
      />
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
    </button>
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
