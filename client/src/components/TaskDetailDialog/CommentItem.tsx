/**
 * Node modules
 */
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { FileIcon, PenLineIcon, TrashIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useCommentMutations } from '@/hooks/useComments';

/**
 * Types
 */
import type { Comment } from '@/types/comment';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentForm } from '@/components/TaskDetailDialog/CommentForm';

export const CommentItem = ({ comment }: { comment: Comment }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { deleteComment } = useCommentMutations(comment.taskId);

  const handleDelete = () => {
    deleteComment.mutate(comment.id);
  };

  const renderFileAttachment = () => {
    if (!comment.fileUrl || !comment.fileType) {
      return null;
    }

    if (comment.fileType.startsWith('image/')) {
      return (
        <a
          href={comment.fileUrl}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-2 block'
        >
          <img
            src={comment.fileUrl}
            alt={comment.fileName ?? 'Uploaded image'}
            className='max-h-64 max-w-full rounded-md border object-cover'
          />
        </a>
      );
    }
    if (comment.fileType.startsWith('audio/')) {
      return (
        <audio
          controls
          src={comment.fileUrl}
          className='mt-2 w-full'
        >
          Your browser does not support the audio element.
        </audio>
      );
    }

    return (
      <a
        href={comment.fileUrl}
        target='_blank'
        rel='noopener noreferrer'
        download={comment.fileName}
        className='bg-accent/50 text-muted-foreground hover:bg-accent mt-2 flex items-center gap-3 rounded-md border p-3 transition-colors'
      >
        <FileIcon className='size-6 shrink-0' />
        <span className='truncate text-sm font-medium'>
          {comment.fileName ?? 'Attached file'}
        </span>
      </a>
    );
  };

  if (showCommentForm) {
    return (
      <CommentForm
        mode='edit'
        taskId={comment.taskId}
        comment={comment}
        onDone={() => setShowCommentForm(false)}
      />
    );
  }

  return (
    <>
      <div className='group/card flex items-start gap-3 p-2'>
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
          <p className='text-sm'>
            {comment.content && <p>{comment.content}</p>}
            {renderFileAttachment()}
          </p>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            onClick={() => setShowCommentForm(true)}
            variant={'ghost'}
            className='size-7 rounded-sm text-blue-500 opacity-0 duration-100 ease-in-out group-hover/card:opacity-100 hover:text-blue-500'
          >
            <PenLineIcon className='size-4' />
          </Button>

          <Button
            variant={'ghost'}
            onClick={() => setShowConfirm(true)}
            className='size-7 rounded-sm text-red-500 opacity-0 duration-100 ease-in-out group-hover/card:opacity-100 hover:text-red-500'
          >
            <TrashIcon className='size-4' />
          </Button>
        </div>
      </div>
      <ConfirmDialog
        showOverlay={false}
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title='Delete Comment?'
        description={<p>This comment will be permanently deleted.</p>}
        onConfirm={handleDelete}
        className='top-[20%]'
        okLabel='Delete'
      />
    </>
  );
};
