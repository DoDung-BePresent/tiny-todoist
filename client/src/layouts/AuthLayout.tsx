/**
 * Node modules
 */
import { Outlet } from 'react-router';

/**
 * Components
 */
import { Logo } from '@/components/Logo';

const AuthLayout = () => {
  return (
    <div className='container mx-auto flex h-screen flex-col bg-[#fefdfc] px-10 py-5'>
      <header className='mb-10'>
        <Logo />
      </header>
      <div className='flex flex-1 items-center justify-center'>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
