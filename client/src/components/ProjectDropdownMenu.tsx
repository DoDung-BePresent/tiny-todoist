import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PenLineIcon, TrashIcon } from 'lucide-react';
import { ConfirmDialog } from './ConfirmDialog';
import { useProjectMutation } from '@/hooks/useProject';

export const ProjectDropdownMenu = ({
  id,
  name,
  children,
}: {
  id: string;
  name: string;
  children: React.ReactNode;
}) => {
  const { deleteProject } = useProjectMutation();

  const handleDelete = () => {
    deleteProject.mutate(id);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align='start'
        side='right'
        className='w-40'
      >
        <DropdownMenuItem>
          <PenLineIcon />
          Edit
        </DropdownMenuItem>
        <ConfirmDialog
          title='Delete Project?'
          description={
            <p>
              The <span className='font-medium text-black'>{name}</span> project
              and all of its tasks will be permanently deleted.
            </p>
          }
          onConfirm={handleDelete}
        >
          <DropdownMenuItem className='!text-red-500'>
            <TrashIcon className='text-red-500' />
            Delete
          </DropdownMenuItem>
        </ConfirmDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
