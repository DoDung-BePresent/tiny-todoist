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
import { useState } from 'react';

type ProjectDialogProps = {
  children: React.ReactNode;
};

export const ProjectDialog = ({ children }: ProjectDialogProps) => {
  const [isAddingProject, setIsAddingProject] = useState(false);
  return (
    <Dialog
      open={isAddingProject}
      onOpenChange={setIsAddingProject}
    >
      <DialogOverlay className='bg-black/50' />
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='p-0'
      >
        <DialogHeader className='flex flex-row items-center border-b p-2 pl-4'>
          <DialogTitle className='flex-1'>Add Project</DialogTitle>
          <DialogClose className=''>
            <XIcon
              className='hover:bg-accent text-muted-foreground size-8 rounded-sm p-1 hover:text-black'
              strokeWidth={1.5}
            />
            <span className='sr-only'>Close</span>
          </DialogClose>
        </DialogHeader>
        <ProjectForm
          onDone={() => setIsAddingProject(false)}
          className='p-4 pt-0'
        />
      </DialogContent>
    </Dialog>
  );
};
