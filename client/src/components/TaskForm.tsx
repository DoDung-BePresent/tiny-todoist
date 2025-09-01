import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTaskMutations } from '@/hooks/useTasks';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import {
  CalendarIcon,
  CheckIcon,
  ChevronDown,
  FlagIcon,
  HashIcon,
  InboxIcon,
  XIcon,
} from 'lucide-react';
import { Calendar } from './ui/calendar';
import type { Task } from '@/types/task';
import { formatCustomDate, getTaskDueDateColorClass } from '@/lib/date';
import { useState } from 'react';
import { PRIORITIES } from '@/constants/task';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './ui/command';
import { useProjectsQuery } from '@/hooks/useProject';

type TaskFromProps = {
  type?: 'dialog' | 'card';
  className?: string;
  onDone?: () => void;
  mode?: 'create' | 'edit';
  task?: Task;
  initialValues?: Partial<z.infer<typeof formSchema>>;
};

const formSchema = z.object({
  title: z.string().trim().min(1, 'Title cannot be empty'),
  description: z.string().trim().optional(),
  dueDate: z.date().nullable().optional(),
  priority: z.enum(['P1', 'P2', 'P3', 'P4']).optional(),
  projectId: z.string().nullable().optional(),
});

export const TaskForm = ({
  className,
  onDone,
  mode = 'create',
  type = 'dialog',
  task,
  initialValues,
}: TaskFromProps) => {
  const { projects } = useProjectsQuery();
  const { createTask, updateTask } = useTaskMutations();
  const [showCalendar, setShowCalendar] = useState(false);
  const [showPriority, setShowPriority] = useState(false);
  const [showProjectPopover, setShowProjectPopover] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === 'edit'
        ? {
            title: task?.title ?? '',
            description: task?.description ?? '', // Textarea must have string value not null or undefined
            dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
            priority: task?.priority,
            projectId: task?.projectId,
          }
        : initialValues,
    mode: 'onChange',
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (mode === 'create') {
      createTask.mutate(values, {
        onSuccess: () => {
          form.reset();
          onDone?.();
        },
      });
    } else {
      updateTask.mutate(
        { taskId: task!.id, payload: values },
        {
          onSuccess: () => {
            onDone?.();
          },
        },
      );
    }
  };

  return (
    <Card
      className={cn(
        'border-0 p-0 shadow-none',
        {
          'rounded-sm border': type === 'card',
        },
        className,
      )}
    >
      <CardContent
        className={cn('px-0 py-4', {
          'py-0': type === 'card',
        })}
      >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div
              className={cn('max-h-60 overflow-y-auto px-4 pb-4', {
                'px-2 pb-2': type === 'card',
              })}
            >
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder='Task name'
                        className={cn(
                          'border-0 px-1 pb-0 !text-xl font-semibold shadow-none focus-visible:ring-0',
                          {
                            '!text-base': type === 'card',
                          },
                        )}
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
                        className='min-h-5 resize-none border-0 p-1 pt-0 shadow-none focus-visible:ring-0'
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className='mt-1 flex items-center gap-2'>
                <FormField
                  control={form.control}
                  name='dueDate'
                  render={({ field }) => (
                    <FormItem>
                      <div className='hover:bg-accent flex items-center rounded-[6px] border hover:text-black'>
                        <Popover
                          open={showCalendar}
                          onOpenChange={setShowCalendar}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <button
                                type='button'
                                className={cn(
                                  'text-muted-foreground flex h-6.5 items-center gap-1.5 px-2 text-sm font-normal shadow-none',
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
                          <PopoverContent
                            align='start'
                            className='w-auto p-0'
                          >
                            <Calendar
                              disabled={{ before: new Date() }}
                              mode='single'
                              selected={field.value ? field.value : undefined}
                              onSelect={(e) => {
                                field.onChange(e);
                                setShowCalendar(false);
                              }}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {field.value && (
                          <XIcon
                            strokeWidth={2}
                            className='text-muted-foreground mr-2 size-4 rounded-sm p-0.5 hover:bg-black/5'
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
                <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                    <FormItem>
                      <div className='hover:bg-accent flex items-center rounded-[6px] border hover:text-black'>
                        <Popover
                          open={showPriority}
                          onOpenChange={setShowPriority}
                        >
                          <PopoverTrigger asChild>
                            <FormControl>
                              <button
                                type='button'
                                className={cn(
                                  'text-muted-foreground flex h-6.5 items-center gap-1.5 px-2 text-sm font-normal shadow-none',
                                  {
                                    'border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500':
                                      field.value === 'P1',
                                    'border-amber-500 text-amber-500 hover:bg-amber-50 hover:text-amber-500':
                                      field.value === 'P2',
                                    'border-blue-500 text-blue-500 hover:bg-blue-50 hover:text-blue-500':
                                      field.value === 'P3',
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
                          <PopoverContent className='w-[150px] p-0'>
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
                            className='text-muted-foreground mr-2 size-4 rounded-sm p-0.5 hover:bg-black/5'
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
            <div
              className={cn(
                'flex items-center justify-between border-t-[1px] p-4 pb-0',
                {
                  'p-2': type === 'card',
                },
              )}
            >
              <FormField
                control={form.control}
                name='projectId'
                render={({ field }) => (
                  <FormItem>
                    <Popover
                      open={showProjectPopover}
                      onOpenChange={setShowProjectPopover}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            size='sm'
                            variant='ghost'
                            className='text-muted-foreground data-[state=open]:bg-accent rounded-[6px]'
                          >
                            {field.value ? (
                              <>
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
                              </>
                            ) : (
                              <>
                                <InboxIcon />
                                Inbox
                              </>
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
                                    form.setValue('projectId', project.id);
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
              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  className='rounded-[6px]'
                  onClick={onDone}
                  disabled={createTask.isPending || updateTask.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type='submit'
                  size='sm'
                  className='rounded-[6px]'
                  disabled={
                    createTask.isPending ||
                    updateTask.isPending ||
                    !form.formState.isValid
                  }
                >
                  {createTask.isPending || updateTask.isPending
                    ? mode === 'edit'
                      ? 'Saving...'
                      : 'Adding...'
                    : mode === 'edit'
                      ? 'Save'
                      : 'Add task'}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
