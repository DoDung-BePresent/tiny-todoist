/**
 * Node modules
 */
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, ChevronRightIcon } from 'lucide-react';

/**
 * Types
 */
import type { Task } from '@/types/task';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { TaskCard } from './TaskCard';

type TaskItemProps = {
  task: Task;
};

export const TaskItem = ({ task }: TaskItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <div className='relative'>
      {hasSubtasks && showButton && (
        <Button
          variant='ghost'
          size='sm'
          className='text-muted-foreground absolute top-[9px] -left-7 size-6 rounded-sm stroke-1 p-0'
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronDownIcon className='size-4' />
          ) : (
            <ChevronRightIcon className='size-4' />
          )}
        </Button>
      )}

      <TaskCard
        task={task}
        onOpenForm={() => setShowButton(false)}
        onCloseForm={() => setShowButton(true)}
      />

      <AnimatePresence>
        {isExpanded && hasSubtasks && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className='pl-7'
          >
            {/* FIXME: Complete task van con hiem thi o day a */}
            {task.subtasks?.map((subtask) => (
              <TaskCard
                key={subtask.id}
                task={subtask}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
