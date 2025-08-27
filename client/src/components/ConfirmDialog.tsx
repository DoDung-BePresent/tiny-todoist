import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
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
  onSubmit?: () => void;
  className?: string;
};

export const ConfirmDialog = ({
  title,
  description,
  children,
  onCancel,
  onSubmit,
  className,
}: ConfirmDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        className={cn('', className)}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant='outline'
              onClick={onCancel}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            type='submit'
            onClick={onSubmit}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
