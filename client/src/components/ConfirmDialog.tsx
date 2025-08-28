import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type ConfirmDialogProps = {
  title: string;
  description?: React.ReactElement;
  children: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  okLabel?: string;
  cancelLabel?: string;
  className?: string;
};

export const ConfirmDialog = ({
  title,
  description,
  children,
  onCancel,
  onConfirm,
  okLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  className,
}: ConfirmDialogProps) => {
  return (
    <Dialog>
      <DialogOverlay className='bg-black/50' />
      <DialogTrigger>{children}</DialogTrigger>
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
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          </DialogClose>
          <Button
            size='sm'
            type='submit'
            className='rounded-sm text-xs'
            onClick={onConfirm}
          >
            {okLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
