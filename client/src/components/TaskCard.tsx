import { useState } from 'react';
import { CalendarIcon, CheckIcon, CircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/task';
import { format } from 'date-fns';
import { formatCustomDate } from '@/lib/date';

type TaskCardProps = Pick<
  Task,
  'id' | 'title' | 'description' | 'completed' | 'dueDate'
>;

//TODO: add animation when complete task
export const TaskCard = ({
  id,
  title,
  description,
  completed: initialState,
  dueDate,
}: TaskCardProps) => {
  const [completed, setCompleted] = useState(initialState);
  return (
    <div className='border-b'>
      <div className='flex items-start gap-2 py-2'>
        <CheckButton
          completed={completed}
          setCompleted={setCompleted}
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
  setCompleted,
  className,
}: {
  completed: boolean;
  setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) => {
  return (
    <button
      className={cn('relative cursor-pointer', className)}
      onClick={() => setCompleted(!completed)}
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
