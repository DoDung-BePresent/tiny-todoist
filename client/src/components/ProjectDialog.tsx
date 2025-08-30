import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { ProjectForm } from './ProjectForm';
import { XIcon } from 'lucide-react';
import type { Project } from '@/types/project';
import { useState } from 'react';

type ProjectDialogProps = {
  children?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  mode?: 'create' | 'edit';
  project?: Project;
};

export const ProjectDialog = ({
  children,
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  mode = 'create',
  project,
}: ProjectDialogProps) => {
  console.log(controlledOpen !== undefined);
  const isControlled = controlledOpen !== undefined;

  const [internalOpen, setInternalOpen] = useState(false);

  const open = isControlled ? controlledOpen : internalOpen;
  const onOpenChange = isControlled ? setControlledOpen! : setInternalOpen;

  const title = mode === 'create' ? 'Add Project' : 'Edit Project';

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogOverlay className='bg-black/50' />
      <DialogContent
        showCloseButton={false}
        className='p-0'
      >
        <DialogHeader className='flex flex-row items-center border-b p-2 pl-4'>
          <DialogTitle className='flex-1'>{title}</DialogTitle>
          <DialogClose className=''>
            <XIcon
              className='hover:bg-accent text-muted-foreground size-8 rounded-sm p-1 hover:text-black'
              strokeWidth={1.5}
            />
            <span className='sr-only'>Close</span>
          </DialogClose>
        </DialogHeader>
        <ProjectForm
          mode={mode}
          project={project}
          onDone={() => onOpenChange(false)}
          className='p-4 pt-0'
        />
      </DialogContent>
    </Dialog>
  );
};
