/**
 * Node modules
 */
import { Link } from 'react-router';

/**
 * Components
 */
import { Logo } from '@/components/Logo';

export const Header = () => {
  return (
    <header className='py-5'>
      <Link to={'/'}>
        <Logo />
      </Link>
    </header>
  );
};
