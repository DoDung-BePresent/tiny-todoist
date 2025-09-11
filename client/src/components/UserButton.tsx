/**
 * Node modules
 */
import { ChevronDown, LogOutIcon, PlusIcon, SettingsIcon } from 'lucide-react';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

/**
 * Utils
 */
import { getAvatarColor } from '@/utils/color';

/**
 * Components
 */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const UserButton = () => {
  const { user, logout } = useAuth();
  const avatarChar = user?.name?.charAt(0).toUpperCase() || '';
  const { bg, border } = getAvatarColor(avatarChar);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className='outline-none'
        asChild
      >
        <div className='hover:bg-sidebar-accent data-[state=open]:bg-accent flex max-w-fit items-center gap-2 rounded-[5.5px] px-1 py-0.5'>
          <Avatar
            className='size-7'
            style={{ background: bg, border: `2px solid ${border}` }}
          >
            <AvatarImage src={user?.avatar ?? undefined} />
            <AvatarFallback
              className='text-sm font-medium'
              style={{ background: bg, borderColor: border, color: border }}
            >
              {avatarChar}
            </AvatarFallback>
          </Avatar>
          <span className='truncate text-sm font-medium'>{user?.name}</span>
          <ChevronDown className='mt-0.5 size-4' />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-72'
        align='start'
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className='pb-0.5'>{user?.name}</DropdownMenuLabel>
          <DropdownMenuLabel className='pt-0 text-xs font-normal'>
            {user?.email}
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <SettingsIcon
              className='size-5'
              strokeWidth={1.5}
            />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <PlusIcon
              className='size-5'
              strokeWidth={1.5}
            />
            Add a team
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={logout}>
            <LogOutIcon
              className='size-5'
              strokeWidth={1.5}
            />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
