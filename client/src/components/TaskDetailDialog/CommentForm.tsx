/**
 * Node modules
 */
import z from 'zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MicIcon, Paperclip, SmileIcon, XIcon } from 'lucide-react';

/**
 * Types
 */
import type { Comment } from '@/types/comment';

/**
 * Hooks
 */
import { useCommentMutations } from '@/hooks/useComments';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';

type CommentFormProps = {
  taskId: string;
  comment?: Comment;
  mode?: 'create' | 'edit';
  onDone: () => void;
  initialValues?: Partial<z.infer<typeof formSchema>>;
};

const formSchema = z.object({
  content: z.string().optional(),
  file: z.instanceof(File).optional(),
});

export const CommentForm = ({
  taskId,
  comment,
  mode = 'create',
  onDone,
  initialValues,
}: CommentFormProps) => {
  const { createComment, updateComment } = useCommentMutations(taskId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues:
      mode === 'edit'
        ? {
            content: comment?.content ?? '',
          }
        : initialValues,
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      form.setValue('file', file, { shouldValidate: true });
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    form.setValue('file', undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (mode === 'create') {
      createComment.mutate(
        {
          content: values.content,
          file: selectedFile ?? undefined,
        },
        {
          onSuccess: () => {
            form.reset();
            removeFile();
            onDone?.();
          },
        },
      );
    } else {
      updateComment.mutate(
        {
          commentId: comment!.id,
          payload: {
            content: values.content!,
          },
        },
        {
          onSuccess: () => {
            onDone?.();
          },
        },
      );
    }
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

        {selectedFile && (
          <div className='bg-accent/50 text-muted-foreground mb-2 flex items-center justify-between rounded-md p-2 text-sm'>
            <span>{selectedFile.name}</span>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='size-6 p-0'
              onClick={removeFile}
            >
              <XIcon className='size-4' />
            </Button>
          </div>
        )}

        <div className='flex items-center justify-between'>
          <div className='space-x-1'>
            <input
              type='file'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='hidden'
            />
            <Button
              type='button'
              variant='ghost'
              className='text-muted-foreground size-8 rounded-sm hover:text-black'
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className='size-4.5 stroke-1' />
            </Button>
            <Button
              type='button'
              variant='ghost'
              className='text-muted-foreground size-8 rounded-sm hover:text-black'
            >
              <MicIcon className='size-4.5 stroke-1' />
            </Button>
            <Button
              type='button'
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
              onClick={onDone}
              disabled={createComment.isPending || updateComment.isPending}
            >
              Cancel
            </Button>
            <Button
              type='submit'
              size='sm'
              className='rounded-[6px]'
              disabled={
                createComment.isPending ||
                updateComment.isPending ||
                !form.formState.isValid
              }
            >
              {createComment.isPending || updateComment.isPending
                ? mode === 'edit'
                  ? 'Saving...'
                  : 'Commenting...'
                : mode === 'create'
                  ? 'Comment'
                  : 'Save'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
