import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ConfirmDialogProps = {
  title: string;
  description?: React.ReactElement;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  okLabel?: string;
  cancelLabel?: string;
  className?: string;
  showOverlay?: boolean;
};

export const ConfirmDialog = ({
  title,
  description,
  open,
  onOpenChange,
  onCancel,
  onConfirm,
  okLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  showOverlay = true,
  className,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm?.();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {showOverlay && <DialogOverlay className='bg-black/50' />}
      <DialogContent
        className={cn('p-4', className)}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className='text-base'>{title}</DialogTitle>
          {description && (
            <DialogDescription className='text-sm'>
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              size='sm'
              variant='secondary'
              className='rounded-sm text-xs'
              onClick={handleCancel}
            >
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            size='sm'
            type='submit'
            className='rounded-sm text-xs'
            onClick={handleConfirm}
          >
            {okLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
