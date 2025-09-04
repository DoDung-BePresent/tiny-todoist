/**
 * Node modules
 */
import z from 'zod';
import {
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  EllipsisIcon,
  FlagIcon,
  HashIcon,
  InboxIcon,
  XIcon,
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { PlusIcon, CornerDownRight } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Types
 */
import type { Task } from '@/types/task';

/**
 * Constants
 */
import { PRIORITIES } from '@/constants/task';

/**
 * Libs
 */
import { cn } from '@/lib/utils';
import { playSound } from '@/lib/sound';
import { formatCustomDate, getTaskDueDateColorClass } from '@/lib/date';

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { TaskForm } from '@/components/TaskForm';
import { Calendar } from '@/components/ui/calendar';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CheckButton, TaskCard } from '@/components/TaskCard';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

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
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showSubTaskForm, setShowSubTaskForm] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [showProjectPopover, setShowProjectPopover] = useState(false);

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
            <div className='col-span-2 p-5 pt-2'>
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
                              projectId: currentProject
                                ? currentProject.id
                                : undefined,
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
              {!showTaskForm &&
                task.subtasks &&
                task.subtasks?.length === 0 && (
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
              {(!showTaskForm || !showSubTaskForm) && (
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
                    onSubmit={form.handleSubmit(onSubmit)}
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
            <div className='col-span-1 space-y-2 bg-[#ffefe5]/40 p-5'>
              <FormField
                control={form.control}
                name='projectId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground'>
                      Project
                    </FormLabel>
                    <Popover
                      open={showProjectPopover}
                      onOpenChange={setShowProjectPopover}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-muted-foreground rounded-[6px] font-normal hover:bg-[#ffefe5] data-[state=open]:bg-[#ffefe5] data-[state=open]:text-black'
                          >
                            {field.value ? (
                              <div className='flex w-full items-center gap-2'>
                                <HashIcon
                                  strokeWidth={1.5}
                                  color={
                                    projects?.find(
                                      (project) => project.id === field.value,
                                    )?.color
                                  }
                                />
                                {
                                  projects?.find(
                                    (project) => project.id === field.value,
                                  )?.name
                                }
                              </div>
                            ) : (
                              <div className='flex w-full items-center gap-2'>
                                <InboxIcon />
                                Inbox
                              </div>
                            )}
                            <ChevronDown />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className='p-0'>
                        {/* TODO: Mặc dù đã có giá trị rồi nhưng mà nó vẫn focus vào inbox */}
                        <Command>
                          <CommandInput placeholder='Type a project name' />
                          <CommandList>
                            <CommandEmpty>No project found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                onSelect={() => {
                                  form.setValue('projectId', null as any, {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                  });
                                  setShowProjectPopover(false);
                                }}
                              >
                                <InboxIcon />
                                Inbox
                              </CommandItem>
                              <CommandSeparator className='my-1' />
                              {projects?.map((project) => (
                                <CommandItem
                                  key={project.id}
                                  value={project.id}
                                  onSelect={() => {
                                    form.setValue('projectId', project.id, {
                                      shouldDirty: true,
                                    });
                                    setShowProjectPopover(false);
                                  }}
                                >
                                  <HashIcon
                                    strokeWidth={1.5}
                                    color={project.color}
                                  />
                                  <span>{project.name}</span>
                                  <CheckIcon
                                    className={cn(
                                      'text-primary ml-auto',
                                      project.id === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <Separator />
              <FormField
                control={form.control}
                name='dueDate'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground'>
                      Date
                    </FormLabel>
                    <div className='group/due-date-component relative flex items-center overflow-clip rounded-[6px] hover:bg-[#ffefe5]'>
                      <Popover
                        open={showCalendar}
                        onOpenChange={setShowCalendar}
                      >
                        <PopoverTrigger asChild>
                          {/* FIXME: hover bi mat mau text cua today, tomorrow, yesterday */}
                          <FormControl className='w-full'>
                            <button
                              type='button'
                              className={cn(
                                'text-muted-foreground flex h-8 items-center gap-1.5 px-2 text-sm font-normal shadow-none group-hover/due-date-component:text-black data-[state=open]:bg-[#ffefe5]',
                                field.value
                                  ? `${getTaskDueDateColorClass(field.value, false)}`
                                  : '',
                              )}
                            >
                              <CalendarIcon
                                strokeWidth={2}
                                className='size-4'
                              />
                              {field.value
                                ? formatCustomDate(field.value)
                                : 'Date'}
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0'>
                          <Calendar
                            disabled={{ before: new Date() }}
                            mode='single'
                            selected={field.value ? field.value : undefined}
                            onSelect={(e) => {
                              field.onChange(e);
                              setShowCalendar(false);
                            }}
                          />
                        </PopoverContent>
                        <PopoverTrigger />
                      </Popover>
                      {field.value && (
                        <XIcon
                          strokeWidth={2}
                          className='text-muted-foreground absolute right-2 size-4 rounded-sm p-0.5 hover:bg-black/5'
                          onClick={() => {
                            form.setValue('dueDate', null as any, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <Separator />
              <FormField
                control={form.control}
                name='priority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-muted-foreground'>
                      Priority
                    </FormLabel>
                    <div className='relative flex items-center overflow-clip rounded-[6px] hover:bg-[#ffefe5]'>
                      <Popover
                        open={showPriority}
                        onOpenChange={setShowPriority}
                      >
                        <PopoverTrigger asChild>
                          <FormControl className='w-full'>
                            <button
                              type='button'
                              className={cn(
                                'text-muted-foreground flex h-8 items-center gap-1.5 px-2 text-sm font-normal data-[state=open]:bg-[#ffefe5]',
                                {
                                  'text-red-500': field.value === 'P1',
                                  'text-amber-500': field.value === 'P2',
                                  'text-blue-500': field.value === 'P3',
                                },
                              )}
                            >
                              <FlagIcon
                                strokeWidth={2}
                                className='size-4'
                              />
                              {PRIORITIES.find((p) => p.value === field.value)
                                ?.label ?? 'Priority'}
                            </button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-[150px] overflow-clip p-0'>
                          <div className='flex flex-col'>
                            {PRIORITIES.map((p) => (
                              <Button
                                key={p.value}
                                size='sm'
                                variant='ghost'
                                className='justify-start rounded-none font-normal'
                                onClick={() => {
                                  field.onChange(p.value);
                                  setShowPriority(false);
                                }}
                              >
                                <FlagIcon
                                  strokeWidth={2}
                                  className={cn('size-4', {
                                    'text-red-500': p.value === 'P1',
                                    'text-amber-500': p.value === 'P2',
                                    'text-blue-500': p.value === 'P3',
                                  })}
                                />
                                {p.label}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      {field.value && field.value !== 'P4' && (
                        <XIcon
                          strokeWidth={2}
                          className='text-muted-foreground absolute right-2 size-4 rounded-sm p-0.5 hover:bg-black/5'
                          onClick={() => {
                            form.setValue('priority', 'P4', {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        />
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
