/**
 * Node modules
 */
import { useState } from 'react';
import { CornerDownRight, PlusIcon } from 'lucide-react';

/**
 * Types
 */
import type { Task } from '@/types/task';
import type { Project } from '@/types/project';

/**
 * Libs
 */
import { playSound } from '@/lib/sound';

/**
 * Hooks
 */
import { useTaskMutations } from '@/hooks/useTasks';

/**
 * Components
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TaskForm } from '@/components/TaskForm';
import { Textarea } from '@/components/ui/textarea';
import { CheckButton, TaskCard } from '@/components/TaskCard';
import { FormControl, FormField, FormItem } from '@/components/ui/form';

type TaskDetailMain = {
  form: any;
  task: Task;
  onOpenChange: (open: boolean) => void;
  currentProject: Project | undefined;
  onSubmit: (values: any) => void;
};

export const TaskDetailMain = ({
  form,
  task,
  onOpenChange,
  onSubmit,
  currentProject,
}: TaskDetailMain) => {
  const { updateTask } = useTaskMutations();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubTaskForm, setShowSubTaskForm] = useState(false);

  const handleToggleComplete = () => {
    playSound('/complete-sound.mp3');
    updateTask.mutate(
      {
        taskId: task.id,
        payload: {
          completed: !task.completed,
        },
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <div className='p-5 pt-2'>
      <div className='flex items-start gap-1.5'>
        <CheckButton
          completed={task.completed}
          onToggle={handleToggleComplete}
          priority={task.priority}
          className='mt-0.5'
        />
        <div className='min-h-32 w-full rounded-lg border p-2 py-0'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    autoFocus
                    placeholder='Task name'
                    className='w-full border-0 px-1 pb-0 !text-xl font-semibold shadow-none focus-visible:ring-0'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder='Description'
                    className='min-h-5 w-full resize-none border-0 p-1 pt-0 shadow-none focus-visible:ring-0'
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
      {task.subtasks && task.subtasks.length > 0 && (
        <Accordion
          type='single'
          collapsible
          className='pl-6'
          defaultValue='sub-tasks'
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
      {(!showTaskForm && !showSubTaskForm) && (
        <div className='mt-2 flex w-full items-center justify-end gap-2'>
          <Button
            onClick={() => {
              onOpenChange(false);
              form.reset();
            }}
            type='button'
            variant='secondary'
            size='sm'
            className='rounded-[6px]'
            disabled={updateTask.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            type='button'
            size='sm'
            className='min-w-16 rounded-[6px]'
            disabled={updateTask.isPending || !form.formState.isDirty}
          >
            {updateTask.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      )}
    </div>
  );
};
