/**
 * Node modules
 */
import {
  HashIcon,
  ChevronDown,
  InboxIcon,
  CheckIcon,
  CalendarIcon,
  XIcon,
  FlagIcon,
} from 'lucide-react';
import { useState } from 'react';

/**
 * Constants
 */
import { PRIORITIES } from '@/constants/task';

/**
 * Libs
 */
import { cn } from '@/lib/utils';
import { formatCustomDate, getTaskDueDateColorClass } from '@/lib/date';

/**
 * Hooks
 */
import { useProjectsQuery } from '@/hooks/useProject';

/**
 * Components
 */
import {
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
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';

type TaskDetailSidebar = {
  form: any;
};

export const TaskDetailSidebar = ({ form }: TaskDetailSidebar) => {
  const { projects } = useProjectsQuery();
  const [showPriority, setShowPriority] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showProjectPopover, setShowProjectPopover] = useState(false);

  return (
    <div className='h-full space-y-2 bg-[#ffefe5]/40 p-5'>
      <FormField
        control={form.control}
        name='projectId'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-muted-foreground'>Project</FormLabel>
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
            <FormLabel className='text-muted-foreground'>Date</FormLabel>
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
                      {field.value ? formatCustomDate(field.value) : 'Date'}
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
      <Separator className='!h-[0.5px]' />
      <FormField
        control={form.control}
        name='priority'
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-muted-foreground'>Priority</FormLabel>
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
                      {PRIORITIES.find((p) => p.value === field.value)?.label ??
                        'Priority'}
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
  );
};
