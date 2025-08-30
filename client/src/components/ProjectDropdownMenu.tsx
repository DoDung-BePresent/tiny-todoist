import { useProjectMutation } from '@/hooks/useProject';
import { useState } from 'react';
import { ProjectDialog } from './ProjectDialog';
import type { Project } from '@/types/project';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PenLineIcon, TrashIcon } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';

export const ProjectDropdownMenu = ({
  project,
  children,
}: {
  project: Project;
  children: React.ReactNode;
}) => {
  const { deleteProject } = useProjectMutation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = () => {
    deleteProject.mutate(project.id);
  };

  const handleSelect = (callback: () => void) => {
    callback();
    setDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu
        open={dropdownOpen}
        onOpenChange={setDropdownOpen}
      >
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          align='start'
          side='right'
          className='w-40'
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              handleSelect(() => setShowEditDialog(true));
            }}
          >
            <PenLineIcon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className='!text-red-500'
            onSelect={(e) => {
              e.preventDefault();
              handleSelect(() => setShowDeleteConfirm(true));
            }}
          >
            <TrashIcon className='text-red-500' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        mode='edit'
        project={project}
      />

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title='Delete Project?'
        description={
          <p>
            The <span className='font-medium text-black'>{project.name}</span>{' '}
            project and all of its tasks will be permanently deleted.
          </p>
        }
        onConfirm={handleDelete}
        okLabel='Delete'
      />
    </>
  );
};
