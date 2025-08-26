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
import { Calendar1Icon, CalendarIcon, FlagIcon, SunIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { Calendar } from './ui/calendar';
import { useState } from 'react';
import type { Priority } from '@/types/task';
import { format } from 'date-fns';

type TaskFromProps = {
  className?: string;
  onDone?: () => void;
};

const formSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().optional(),
  dueDate: z.date().optional(),
  priority: z.enum(['P1', 'P2', 'P3', 'P4']).optional(),
});

const PRIORITIES: { value: Priority; label: string }[] = [
  {
    value: 'P1',
    label: 'Priority 1',
  },
  {
    value: 'P2',
    label: 'Priority 2',
  },
  {
    value: 'P3',
    label: 'Priority 3',
  },
  {
    value: 'P4',
    label: 'Priority 4',
  },
];

export const TaskForm = ({ className, onDone }: TaskFromProps) => {
  const { createTask } = useTaskMutations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: undefined,
      priority: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createTask.mutate(values, {
      onSuccess: () => {
        form.reset();
        onDone?.();
      },
    });
  };

  return (
    <Card className={cn('border-0 p-0 shadow-none', className)}>
      <CardContent className='px-0 py-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='max-h-60 overflow-y-auto px-4 py-2 pt-0'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        autoFocus
                        placeholder='Task name'
                        className='border-0 px-1 pb-0 !text-xl font-semibold shadow-none focus-visible:ring-0'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='mt-1 flex items-center gap-2'>
                <FormField
                  control={form.control}
                  name='dueDate'
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className={cn(
                                'text-muted-foreground h-7 rounded-[6px] text-sm font-normal shadow-none',
                                field.value && 'text-primary',
                              )}
                            >
                              <CalendarIcon
                                strokeWidth={2}
                                className='size-4'
                              />
                              {field.value
                                ? format(field.value, 'MMM d')
                                : 'Date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          align='start'
                          className='w-auto p-0'
                        >
                          <Calendar
                            mode='single'
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='priority'
                  render={({ field }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type='button'
                              variant='outline'
                              size='sm'
                              className={cn(
                                'text-muted-foreground h-7 rounded-[6px] text-sm font-normal shadow-none',
                                field.value && 'text-primary',
                              )}
                            >
                              <FlagIcon
                                strokeWidth={2}
                                className='size-4'
                              />
                              {PRIORITIES.find((p) => p.value === field.value)
                                ?.label ?? 'Priority'}
                            </Button>
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
                                onClick={() => field.onChange(p.value)}
                              >
                                {p.label}
                              </Button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className='flex items-center justify-end gap-2 border-t-[1px] p-4 pb-0'>
              <Button
                type='button'
                variant='secondary'
                size='sm'
                className='rounded-[6px]'
                onClick={onDone}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                size='sm'
                className='rounded-[6px]'
                disabled={createTask.isPending}
              >
                {createTask.isPending ? 'Adding...' : 'Add task'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// const DatePicker = () => {
//   const [date, setDate] = useState<Date | undefined>(new Date());

//   return (
//     <Popover>
//       <PopoverTrigger>
//         <Button
//           type='button'
//           variant='outline'
//           size='sm'
//           className='text-muted-foreground h-7 rounded-[6px] text-sm font-normal shadow-none'
//         >
//           <CalendarIcon
//             strokeWidth={2}
//             className='size-4'
//           />
//           Date
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent
//         side='right'
//         align='center'
//         sideOffset={0}
//         className='w-[250px] border-0 px-0 shadow-[0_1px_8px_rgba(0,0,0,.08),0_0_1px_rgba(0,0,0,.3)]'
//       >
//         <div className='mb-2'>
//           <button className='hover:bg-accent flex w-full items-center gap-2.5 px-4 py-1.5'>
//             <Calendar1Icon className='size-5 stroke-1 text-green-500' />
//             <span className='text-sm'>Today</span>
//           </button>
//           <button className='hover:bg-accent flex w-full items-center gap-2.5 px-4 py-1.5'>
//             <SunIcon className='size-5 stroke-1 text-orange-500' />
//             <span className='text-sm'>Tomorrow</span>
//           </button>
//         </div>
//         <Separator />
//         <div className=''>
//           <Calendar
//             mode='single'
//             selected={date}
//             onSelect={setDate}
//             className='rounded-lg border-0'
//           />
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };

// const PriorityPicker = () => {
//   return (
//     <Popover>
//       <PopoverTrigger>
//         <Button
//           type='button'
//           variant='outline'
//           size='sm'
//           className='text-muted-foreground h-7 rounded-[6px] text-sm font-normal shadow-none'
//         >
//           <FlagIcon
//             strokeWidth={2}
//             className='size-4'
//           />
//           Priority
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className='w-[130px] p-0'>
//         <div className='flex flex-col'>
//           <Button
//             size='sm'
//             variant='ghost'
//             className='rounded-none font-normal'
//           >
//             Priority 1
//           </Button>
//           <Button
//             size='sm'
//             variant='ghost'
//             className='rounded-none font-normal'
//           >
//             Priority 2
//           </Button>
//           <Button
//             size='sm'
//             variant='ghost'
//             className='rounded-none font-normal'
//           >
//             Priority 3
//           </Button>
//           <Button
//             size='sm'
//             variant='ghost'
//             className='rounded-none font-normal'
//           >
//             Priority 4
//           </Button>
//         </div>
//       </PopoverContent>
//     </Popover>
//   );
// };
