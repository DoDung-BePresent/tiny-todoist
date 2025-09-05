/**
 * Node modules
 */
import z from 'zod';
import { EllipsisIcon, HashIcon, InboxIcon, XIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Types
 */
import type { Task } from '@/types/task';

/**
 * Hooks
 */
import { useTaskMutations } from '@/hooks/useTasks';
import { useProjectsQuery } from '@/hooks/useProject';

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

type TaskDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task;
};

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty'),
  description: z.string().trim().optional(),
  dueDate: z.date().nullable().optional(),
  priority: z.enum(['P1', 'P2', 'P3', 'P4']).optional(),
  projectId: z.string().nullable().optional(),
});

export const TaskDetailDialog = ({
  open,
  onOpenChange,
  task,
}: TaskDetailDialogProps) => {
  const { projects } = useProjectsQuery();
  const { updateTask } = useTaskMutations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: task.title,
      description: task.description ?? '',
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      priority: task.priority,
      projectId: task.projectId,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateTask.mutate(
      {
        taskId: task.id,
        payload: values,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  };

  // TODO: Can nhac xem co the dung hook cua project de lay project khong! Output: Project | null
  const currentProject = projects?.find((p) => p.id === task.projectId);

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogOverlay className='bg-black/50' />
      <DialogContent
        showCloseButton={false}
        className='!max-w-4xl gap-0 p-0'
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
                  <InboxIcon />
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

        <Form {...form}>
          <div className='grid grid-cols-3'>
            <div className='col-span-2'>
              <TaskDetailMain
                form={form}
                task={task}
                onOpenChange={onOpenChange}
                currentProject={currentProject}
                onSubmit={onSubmit}
              />
            </div>
            <div className='col-span-1'>
              <TaskDetailSidebar form={form} />
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
