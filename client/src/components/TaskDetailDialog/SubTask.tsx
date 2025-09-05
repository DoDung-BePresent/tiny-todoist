/**
 * Node modules
 */
import { CornerDownRight, PlusIcon } from 'lucide-react';

/**
 * Types
 */
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';

/**
 * Components
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';

type SubTaskProps = {
  task: Task;
  currentProject: Project | undefined;
  showTaskForm: boolean;
  setShowTaskForm: React.Dispatch<React.SetStateAction<boolean>>;
  showSubTaskForm: boolean;
  setShowSubTaskForm: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SubTask = ({
  task,
  currentProject,
  setShowSubTaskForm,
  setShowTaskForm,
  showSubTaskForm,
  showTaskForm,
}: SubTaskProps) => {
  return (
    <div className='pl-6'>
      {task.subtasks && task.subtasks.length > 0 && (
        <Accordion
          type='single'
          collapsible
        >
          <AccordionItem value='sub-tasks'>
            <AccordionTrigger>Sub-tasks</AccordionTrigger>
            <AccordionContent className='pl-7'>
              {task.subtasks?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  classNames={{
                    checkButton: '!mt-0',
                  }}
                />
              ))}
              {!showSubTaskForm && (
                <button
                  type='button'
                  onClick={() => setShowSubTaskForm(true)}
                  className='group/button hover:text-primary text-muted-foreground flex w-full cursor-pointer items-center gap-2 p-1.5 px-0.5 py-2.5 text-sm'
                >
                  <PlusIcon
                    className='text-primary group-hover/button:bg-primary size-5.5 rounded-full p-[1px] group-hover/button:text-white'
                    strokeWidth={1.5}
                  />
                  Add task
                </button>
              )}
              {showSubTaskForm && (
                <div className='mt-2 flex items-start gap-1'>
                  <CornerDownRight className='text-muted-foreground stroke-1' />
                  <TaskForm
                    type='card'
                    mode='create'
                    className='flex-1'
                    initialValues={{
                      projectId: currentProject ? currentProject.id : undefined,
                      parentId: task.id,
                    }}
                    onDone={() => setShowSubTaskForm(false)}
                  />
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {!showTaskForm && task.subtasks && task.subtasks?.length === 0 && (
        <div className='mt-2 ml-6'>
          <Button
            size='sm'
            variant='ghost'
            type='button'
            onClick={() => setShowTaskForm(true)}
            className='text-muted-foreground rounded-[6px] text-xs'
          >
            <PlusIcon />
            Add sub-task
          </Button>
        </div>
      )}
      {showTaskForm && (
        <div className='mt-2 flex items-start gap-1'>
          <CornerDownRight className='text-muted-foreground ml-7 stroke-1' />
          <TaskForm
            type='card'
            mode='create'
            className='flex-1'
            initialValues={{
              projectId: currentProject ? currentProject.id : undefined,
              parentId: task.id,
            }}
            onDone={() => setShowTaskForm(false)}
          />
        </div>
      )}
    </div>
  );
};
