/**
 * Components
 */
import { TaskForm } from '@/components/TaskForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';

export const TaskDialog = ({ children }: { children: React.ReactNode }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  return (
    <Dialog
      open={isAddingTask}
      onOpenChange={setIsAddingTask}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className='border-0 p-0'
      >
        <TaskForm onDone={() => setIsAddingTask(false)} />
      </DialogContent>
    </Dialog>
  );
};
