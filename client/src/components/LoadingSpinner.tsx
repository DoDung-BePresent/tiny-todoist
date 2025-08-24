/**
 * Assets
 */
import logoImage from '@/assets/logo.png';

export const LoadingSpinner = () => (
  <div className='flex h-screen w-full items-center justify-center'>
    <div className='flex flex-col items-center gap-4'>
      <img
        src={logoImage}
        alt='Logo'
        className='size-14'
      />
      <div className='border-primary/20 border-t-primary size-6 animate-spin rounded-full border-[3px] border-solid' />
    </div>
  </div>
);
