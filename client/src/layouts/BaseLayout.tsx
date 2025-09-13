/**
 * Node modules
 */
import { Link, Outlet } from 'react-router';

/**
 * Assets
 */
import homeCustomerBgImage from '@/assets/home_customer_bg.avif';

/**
 * Components
 */
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';

const BaseLayout = () => {
  return (
    <div className='bg-[#fefdfc]'>
      <div className='relative container mx-auto flex h-screen w-[85vw] flex-col overflow-clip'>
        <header className='flex items-center justify-between py-5'>
          <Logo />

          <div className='space-x-4'>
            <Button
              variant='ghost'
              asChild
            >
              <Link to='/login'>Login</Link>
            </Button>
            <Button asChild>
              <Link to='/register'>Try it for free</Link>
            </Button>
          </div>
        </header>
        <main className='flex flex-1'>
          <Outlet />
        </main>
        <img
          src={homeCustomerBgImage}
          className='absolute right-0 -bottom-40 left-0 w-full'
          alt='Home Customer Background Image'
        />
      </div>
    </div>
  );
};

export default BaseLayout;
