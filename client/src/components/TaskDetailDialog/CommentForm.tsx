/**
 * Node modules
 */
import z from 'zod';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MicIcon, Paperclip, SmileIcon, TrashIcon, XIcon } from 'lucide-react';

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
};

const formSchema = z
  .object({
    content: z.string().trim().optional(),
    file: z.instanceof(File).optional(),
  })
  .refine((data) => !!data.content || !!data.file, {
    message: 'Comment must have content or a file.',
    path: ['content'],
  });

export const CommentForm = ({
  taskId,
  comment,
  mode = 'create',
  onDone,
}: CommentFormProps) => {
  const { createComment, updateComment } = useCommentMutations(taskId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExistingFileRemoved, setIsExistingFileRemoved] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: comment?.content ?? '',
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      form.setValue('file', file, { shouldValidate: true });

      if (mode === 'edit' && comment?.fileUrl) {
        setIsExistingFileRemoved(true);
      }
    }
  };

  const removeNewFile = () => {
    setSelectedFile(null);
    form.setValue('file', undefined, { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeExistingFile = () => {
    setIsExistingFileRemoved(true);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (mode === 'create') {
      const formData = new FormData();
      if (values.content) {
        formData.append('content', values.content);
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      createComment.mutate(formData, {
        onSuccess: () => {
          form.reset();
          removeNewFile();
          onDone?.();
        },
      });
    } else {
      const formData = new FormData();
      let hasChanges = false;

      if (values.content !== comment?.content) {
        formData.append('content', values.content ?? '');
        hasChanges = true;
      }

      if (selectedFile) {
        formData.append('file', selectedFile);
        hasChanges = true;
      } else if (isExistingFileRemoved) {
        formData.append('removeFile', 'true');
        hasChanges = true;
      }

      if (hasChanges) {
        updateComment.mutate(
          { commentId: comment!.id, payload: formData },
          {
            onSuccess: () => {
              onDone?.();
            },
          },
        );
      } else {
        onDone?.();
      }
    }
  };

  const hasExistingFile =
    mode === 'edit' && comment?.fileUrl && !isExistingFileRemoved;

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

        {hasExistingFile && (
          <div className='bg-accent/70 mb-2 flex items-center gap-2 rounded-sm p-2 text-sm'>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='size-6 rounded-xs'
              onClick={removeExistingFile}
            >
              <TrashIcon className='text-red-500' />
            </Button>
            <span className='flex-1'>{comment.fileName}</span>
          </div>
        )}

        {selectedFile && (
          <div className='bg-accent/50 text-muted-foreground mb-2 flex items-center justify-between rounded-md p-2 text-sm'>
            <span>{selectedFile.name}</span>
            <Button
              type='button'
              variant='ghost'
              size='sm'
              className='size-6 p-0'
              onClick={removeNewFile}
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
              disabled={!!hasExistingFile}
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
                ? 'Saving...'
                : mode === 'edit'
                  ? 'Save'
                  : 'Comment'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
