/**
 * Assets
 */
import logoImage from '@/assets/logo.svg';

export const Logo = () => {
  return (
    <div className='flex items-center gap-2'>
      <img
        src={logoImage}
        alt='Logo'
        className='size-7.5'
      />
      <span className='text-primary font-quicksand text-2xl font-extrabold tracking-tight'>
        tiny todoist
      </span>
    </div>
  );
};
