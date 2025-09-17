/**
 * Node modules
 */
import { Outlet } from 'react-router';

/**
 * Stores
 */
import { useDialogStore } from '@/stores/dialog';

/**
 * Components
 */
import { TopAppBar } from './components/TopAppBar';
import { AppSidebar } from './components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TaskDetailDialog } from '@/components/TaskDetailDialog';

const AppLayout = () => {
  const { viewingTaskId, setViewTask } = useDialogStore();
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full p-2.5'>
        <TopAppBar />
        <Outlet />
      </main>
      {viewingTaskId && (
        <TaskDetailDialog
          taskId={viewingTaskId}
          isOpen={!!viewingTaskId}
          onOpenChange={(open) => {
            if (!open) {
              setViewTask(null);
            }
          }}
        />
      )}
    </SidebarProvider>
  );
};

export default AppLayout;
