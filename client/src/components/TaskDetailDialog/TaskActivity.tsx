/**
 * Node modules
 */
import { useState } from 'react';
import { Paperclip } from 'lucide-react';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';
import { useCommentsQuery } from '@/hooks/useComments';

/**
 * Types
 */
import type { User } from '@/types/auth';

/**
 * Components
 */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CommentItem } from './CommentItem';
import { CommentForm } from './CommentForm';

type TaskActivityProps = {
  taskId: string;
};

export const TaskActivity = ({ taskId }: TaskActivityProps) => {
  const { user } = useAuth();
  const { comments } = useCommentsQuery(taskId);

  const [showCommentForm, setShowCommentForm] = useState(false);

  return (
    <div className='mb-5 pl-6'>
      {comments && comments.length > 0 && (
        <Accordion
          type='single'
          collapsible
        >
          <AccordionItem value='comments'>
            <AccordionTrigger className='pt-3'>
              Comments{' '}
              <span className='text-muted-foreground mt-0.5 text-xs font-normal'>
                {comments.length}
              </span>
            </AccordionTrigger>
            <AccordionContent className='space-y-2 py-2 pl-5'>
              {comments?.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      {!showCommentForm && (
        <FormButton
          user={user}
          onClick={() => setShowCommentForm(true)}
        />
      )}
      {showCommentForm && (
        <CommentForm
          taskId={taskId}
          onDone={() => setShowCommentForm(false)}
        />
      )}
    </div>
  );
};

const FormButton = ({
  user,
  onClick,
}: {
  user: User | null;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type='button'
      className='mt-3 flex w-full items-center gap-3'
    >
      <Avatar className='size-8'>
        <AvatarImage src={user?.avatar ?? ''} />
        <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className='text-muted-foreground flex flex-1 items-center justify-between rounded-full border p-1.5 px-4 text-sm transition-colors duration-200 ease-in-out hover:bg-[#ffefe5]/15 hover:text-black'>
        Comment
        <Paperclip className='size-5 stroke-1' />
      </div>
    </button>
  );
};
