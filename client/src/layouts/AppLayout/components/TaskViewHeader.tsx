import { Columns3Icon } from 'lucide-react';

/**
 * Components
 */
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

export const TaskViewHeader = () => {
  const { state } = useSidebar();
  return (
    <div className='flex items-center'>
      <div className='flex-1'>
        {state === 'collapsed' && <SidebarTrigger />}
      </div>
      <Button
        variant='ghost'
        className='h-8 rounded-sm'
      >
        <Columns3Icon
          strokeWidth={1}
          className='mt-0.5 size-5'
        />
        <span className='text-muted-foreground font-medium'>Display</span>
      </Button>
    </div>
  );
};
