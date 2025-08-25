/**
 * Node modules
 */
import { Outlet } from 'react-router';

/**
 * Components
 */
import { Header } from '@/components/Header';

const AuthLayout = () => {
  return (
    <div className='container mx-auto flex h-screen flex-col gap-10 bg-[#fefdfc]'>
      <Header />
      <main className='flex flex-1 items-center justify-center'>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
