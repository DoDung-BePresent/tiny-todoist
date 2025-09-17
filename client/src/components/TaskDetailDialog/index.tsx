/**
 * Node modules
 */
import z from 'zod';
import { useEffect } from 'react';
import { EllipsisIcon, HashIcon, InboxIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Hooks
 */
import { useTaskMutations, useTaskQuery } from '@/hooks/useTasks';
import { useProjectsQuery } from '@/hooks/useProject';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Libs
 */
import { cn } from '@/lib/utils';

/**
 * Components
 */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { TaskDetailSidebar } from './TaskDetailSidebar';
import { TaskDetailMain } from './TaskDetailMain';
import { LoadingSpinner } from '../LoadingSpinner';

type TaskDetailDialogProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
};

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty'),
  description: z.string().trim().optional(),
  dueDate: z.date().nullable().optional(),
  priority: z.enum(['P1', 'P2', 'P3', 'P4']).optional(),
  projectId: z.string().nullable().optional(),
});

export const TaskDetailDialog = ({
  isOpen,
  onOpenChange,
  taskId,
}: TaskDetailDialogProps) => {
  const { task, isLoading } = useTaskQuery(taskId);
  const { projects } = useProjectsQuery();
  const { updateTask } = useTaskMutations();
  const isMobile = useIsMobile();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description ?? '',
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
        priority: task.priority,
        projectId: task.projectId,
      });
    }
  }, [task, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!task) return;
    updateTask.mutate({ taskId: task.id, payload: values });
  };

  const currentProject = projects?.find((p) => p.id === task?.projectId);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay className='bg-black/50' />
      <DialogContent
        showCloseButton={false}
        className={cn(
          '!max-w-4xl gap-0 p-0',
          isMobile && 'h-fit max-h-screen w-full',
        )}
      >
        <DialogHeader className='mb-0 border-b p-2'>
          <div className='flex w-full items-center justify-between'>
            <Button
              size='sm'
              variant='ghost'
              className='text-muted-foreground rounded-sm text-xs'
            >
              {currentProject ? (
                <>
                  <HashIcon
                    strokeWidth={1.5}
                    color={currentProject.color}
                  />
                  {currentProject.name}
                </>
              ) : (
                <>
                  <InboxIcon className='mr-2 size-4' />
                  Inbox
                </>
              )}
            </Button>
            <div className='ml-auto flex items-center gap-1.5'>
              <Button
                variant='ghost'
                className='text-muted-foreground size-8 rounded-sm'
              >
                <EllipsisIcon className='size-5' />
              </Button>
              <DialogClose className='text-muted-foreground hover:bg-accent rounded-sm p-1.5'>
                <XIcon className='size-5' />
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
        {isLoading || !task ? (
          <div className='flex h-[80vh] items-center justify-center'>
            <LoadingSpinner />
          </div>
        ) : (
          <Form {...form}>
            <div
              className={cn(isMobile ? 'flex flex-col' : 'grid grid-cols-3')}
            >
              <div
                className={cn(isMobile ? 'order-1' : 'col-span-2 min-h-[80vh]')}
              >
                <TaskDetailMain
                  form={form}
                  task={task}
                  onOpenChange={onOpenChange}
                  currentProject={currentProject}
                  onSubmit={onSubmit}
                  isSaving={updateTask.isPending}
                />
              </div>
              <div className={cn(isMobile ? 'order-2 border-t' : 'col-span-1')}>
                <TaskDetailSidebar form={form} />
              </div>
            </div>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};
