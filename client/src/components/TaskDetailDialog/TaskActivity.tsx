/**
 * Hooks
 */
import { useCommentsQuery } from '@/hooks/useComments';

/**
 * Components
 */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { CommentItem } from './CommentItem';

type TaskActivityProps = {
  taskId: string;
};

export const TaskActivity = ({ taskId }: TaskActivityProps) => {
  const { comments } = useCommentsQuery(taskId);

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
    </div>
  );
};
