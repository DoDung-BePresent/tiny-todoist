/**
 * Node modules
 */
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { PenLineIcon, TrashIcon } from 'lucide-react';

/**
 * Types
 */
import type { Comment } from '@/types/comment';

/**
 * Components
 */
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConfirmDialog } from '../ConfirmDialog';

export const CommentItem = ({ comment }: { comment: Comment }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => console.log('Delete');
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
          <p className='text-sm'>{comment.content}</p>
        </div>
        <div className='flex items-center gap-1'>
          <Button
            onClick={() => setShowTaskForm(true)}
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
