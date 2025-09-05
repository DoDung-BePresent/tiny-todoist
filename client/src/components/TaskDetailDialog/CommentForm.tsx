/**
 * Node modules
 */
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MicIcon, Paperclip, SmileIcon } from 'lucide-react';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { useCommentMutations } from '@/hooks/useComments';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

type CommentFormProps = {
  taskId: string;
  onCancel: () => void;
};

const formSchema = z.object({
  content: z.string().trim().min(1),
});

export const CommentForm = ({ taskId, onCancel }: CommentFormProps) => {
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='flex-1 rounded-md border p-4'
      >
        <FormField
          control={form.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <textarea
                  autoFocus
                  placeholder='Add a comment...'
                  className='h-16 resize-none text-sm outline-none'
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className='flex items-center justify-between'>
          <div className='space-x-1'>
            <Button
              variant='ghost'
              className='text-muted-foreground size-8 rounded-sm hover:text-black'
            >
              <Paperclip className='size-4.5 stroke-1' />
            </Button>
            <Button
              variant='ghost'
              className='text-muted-foreground size-8 rounded-sm hover:text-black'
            >
              <MicIcon className='size-4.5 stroke-1' />
            </Button>
            <Button
              variant='ghost'
              className='text-muted-foreground size-8 rounded-sm hover:text-black'
            >
              <SmileIcon className='size-4.5 stroke-1' />
            </Button>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              type='button'
              variant='secondary'
              size='sm'
              className='rounded-[6px]'
              onClick={onCancel}
              disabled={createComment.isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              size='sm'
              className='rounded-[6px]'
              disabled={createComment.isPending}
            >
              {createComment.isPending ? 'Commenting...' : 'Comment'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
