import { ChevronDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export const UserButton = () => {
  return (
    <div className='hover:bg-sidebar-accent flex max-w-fit items-center gap-2 rounded-[5.5px] px-1 py-0.5'>
      <Avatar className='size-7'>
        <AvatarImage src='https://github.com/shadcn.png' />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <span className='truncate text-sm font-medium'>QuangDungNgu</span>
      <ChevronDown className='mt-0.5 size-4' />
    </div>
  );
};
