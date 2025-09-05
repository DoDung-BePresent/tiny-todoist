/**
 * Node modules
 */
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { formatDistanceToNow } from 'date-fns';
import { zodResolver } from '@hookform/resolvers/zod';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';
import { useCommentsQuery, useCommentMutations } from '@/hooks/useComments';

/**
 * Components
 */
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';

type TaskActivityProps = {
  taskId: string;
};

const formSchema = z.object({
  content: z.string().trim().min(1),
});

export const TaskActivity = ({ taskId }: TaskActivityProps) => {
  const { user } = useAuth();
  const { comments, isLoading } = useCommentsQuery(taskId);
  const { createComment } = useCommentMutations(taskId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createComment.mutate(values, {
      onSuccess: () => {
        form.reset();
      },
    });
  };

  return (
    <div>
      <div className='mt-4 space-y-4'>
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className='flex items-start gap-3'
            >
              <Skeleton className='size-8 rounded-full' />
              <div className='flex-1 space-y-1'>
                <Skeleton className='h-4 w-1/4' />
                <Skeleton className='h-4 w-3/4' />
              </div>
            </div>
          ))}

        {comments?.map((comment) => (
          <div
            key={comment.id}
            className='flex items-start gap-3'
          >
            <Avatar className='size-8'>
              <AvatarImage src={comment.user.avatar ?? ''} />
              <AvatarFallback>
                {comment.user.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='flex-1'>
              <div className='flex items-center gap-2'>
                <span className='font-semibold'>{comment.user.name}</span>
                <span className='text-muted-foreground text-xs'>
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className='text-sm'>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-6 flex items-start gap-3'>
        <Avatar className='size-8'>
          <AvatarImage src={user?.avatar ?? ''} />
          <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1'
          >
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='Add a comment...'
                      className='rounded-xl'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className='mt-2 flex justify-end'>
              <Button
                type='submit'
                size='sm'
                disabled={!form.formState.isValid || createComment.isPending}
              >
                {createComment.isPending ? 'Commenting...' : 'Comment'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
