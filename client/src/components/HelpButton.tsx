import { Button } from '@/components/ui/button';
import { CircleQuestionMarkIcon } from 'lucide-react';

export const HelpButton = () => {
  return (
    <Button
      variant='ghost'
      className='hover:bg-sidebar-accent justify-start rounded-sm text-black/70'
    >
      <CircleQuestionMarkIcon className='size-5 stroke-1' />
      Help & resources
    </Button>
  );
};
