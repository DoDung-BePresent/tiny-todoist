/**
 * Node modules
 */
import { useState } from 'react';
import { Paperclip } from 'lucide-react';

/**
 * Types
 */
import type { Task } from '@/types/task';
import type { User } from '@/types/auth';
import type { Project } from '@/types/project';

/**
 * Libs
 */
import { playSound } from '@/lib/sound';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';
import { useTaskMutations } from '@/hooks/useTasks';

/**
 * Components
 */
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckButton } from '@/components/TaskCard';
import { FormControl, FormField, FormItem } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { SubTask } from '@/components/TaskDetailDialog/SubTask';
import { CommentForm } from '@/components/TaskDetailDialog/CommentForm';
import { TaskActivity } from '@/components/TaskDetailDialog/TaskActivity';

type TaskDetailMain = {
  form: any;
  task: Task;
  onOpenChange: (open: boolean) => void;
  currentProject: Project | undefined;
  onSubmit: (values: any) => void;
  isSaving: boolean;
};

export const TaskDetailMain = ({
  form,
  task,
  onOpenChange,
  onSubmit,
  currentProject,
  isSaving,
}: TaskDetailMain) => {
  const { user } = useAuth();
  const { updateTask: toggleCompleteTask } = useTaskMutations();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubTaskForm, setShowSubTaskForm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const handleToggleComplete = () => {
    playSound('/complete-sound.mp3');
    toggleCompleteTask.mutate(
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
    <div className='p-5 pt-2 pr-0'>
      <div className='scrollbar-track-transparent scrollbar-thumb-[#c1c1c1] hover:scrollbar-thumb-black/50 scrollbar-thin scrollbar-thumb-rounded-full max-h-[70vh] overflow-y-auto pr-2 [scrollbar-gutter:stable]'>
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
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              type='button'
              size='sm'
              className='min-w-16 rounded-[6px]'
              disabled={isSaving || !form.formState.isDirty}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        )}
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
      </div>

      {!showCommentForm && (
        <CommentButton
          user={user}
          onClick={() => setShowCommentForm(true)}
        />
      )}
      {showCommentForm && (
        <CommentForm
          taskId={task.id}
          onDone={() => setShowCommentForm(false)}
        />
      )}
    </div>
  );
};

const CommentButton = ({
  user,
  onClick,
}: {
  user: User | null;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className='mt-1 flex w-full items-center gap-3 px-6 pr-4'
    >
      <Avatar className='size-8'>
        <AvatarImage src={user?.avatar ?? ''} />
        <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='text-muted-foreground flex flex-1 items-center justify-between rounded-full border p-1.5 px-4 text-sm transition-colors duration-200 ease-in-out hover:bg-[#ffefe5]/15 hover:text-black'>
        Comment
        <Paperclip className='size-5 stroke-1' />
      </div>
    </button>
  );
};
