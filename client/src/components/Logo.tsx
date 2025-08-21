import logoImage from '@/assets/logo.png';

export const Logo = () => {
  return (
    <div className='flex items-center gap-2'>
      <img
        src={logoImage}
        alt='Logo'
        className='size-8'
      />
      <span className='text-primary text-xl font-[750]'>Tiny Todoist</span>
    </div>
  );
};
