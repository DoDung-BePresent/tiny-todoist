/**
 * Node modules
 */
import { Outlet } from 'react-router';

/**
 * Components
 */
import { AppSidebar } from './components/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { TaskViewHeader } from './components/TaskViewHeader';

const AppLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full p-2.5'>
        <TaskViewHeader />
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default AppLayout;
