/**
 * Node modules
 */
import { useState } from 'react';

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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckButton } from '@/components/TaskCard';
import { FormControl, FormField, FormItem } from '@/components/ui/form';

import { TaskActivity } from './TaskActivity';
import { SubTask } from './SubTask';

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
      {/* FIXME: currentProject bi truyen trung gian --> Vo nghia */}
      <SubTask
        setShowTaskForm={setShowTaskForm}
        setShowSubTaskForm={setShowSubTaskForm}
        showTaskForm={showTaskForm}
        showSubTaskForm={showSubTaskForm}
        task={task}
        currentProject={currentProject}
      />
      <TaskActivity taskId={task.id} />

      {!showTaskForm && !showSubTaskForm && (
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
