/**
 * Node modules
 */
import { useNavigate } from 'react-router';

/**
 * Components
 */
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { SettingsLayout } from './SettingsLayout';

export const SettingsDialog = () => {
  const navigate = useNavigate();

  return (
    <Dialog
      open={true}
      onOpenChange={() => navigate(-1)}
    >
      <DialogOverlay className='bg-black/50' />
      <DialogContent className='!max-w-5xl gap-0 p-0 !outline-none'>
        <SettingsLayout />
      </DialogContent>
    </Dialog>
  );
};
