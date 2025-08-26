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

type TaskFromProps = {
  className?: string;
  onDone?: () => void;
};

const formSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty'),
  description: z.string().optional(),
});

export const TaskForm = ({ className, onDone }: TaskFromProps) => {
  const { createTask } = useTaskMutations();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
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
      <CardContent className='p-4'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4'
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
                      className='border-0 px-1 text-base font-semibold shadow-none focus-visible:ring-0'
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
                      className='border-0 px-1 shadow-none focus-visible:ring-0'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center justify-end gap-2 border-t pt-4'>
              <Button
                type='button'
                variant='ghost'
                onClick={onDone}
              >
                Cancel
              </Button>
              <Button
                type='submit'
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
