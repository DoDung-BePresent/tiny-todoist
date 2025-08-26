import { useState } from 'react';
import { CheckIcon, CircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Task } from '@/types/task';

type TaskCardProps = Pick<Task, 'id' | 'title' | 'description' | 'completed'>;

//TODO: add animation when complete task
export const TaskCard = ({
  id,
  title,
  description,
  completed: initialState,
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
        <div className=''>
          <span className='text-sm'>{title}</span>
          <p className='text-muted-foreground text-xs'>{description}</p>
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
