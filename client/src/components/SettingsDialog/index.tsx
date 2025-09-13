/**
 * Node modules
 */
import { useLocation, useNavigate } from 'react-router';

/**
 * Components
 */
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { SettingsLayout } from './SettingsLayout';

const SettingsDialog = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const originPath = location.state?.originPath || '/app/inbox';

  const handleClose = () => {
    navigate(originPath, { replace: true });
  };

  return (
    <Dialog
      open={true}
      onOpenChange={handleClose}
    >
      <DialogOverlay className='bg-black/50' />
      <DialogContent className='!max-w-5xl gap-0 p-0 !outline-none'>
        <SettingsLayout />
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
