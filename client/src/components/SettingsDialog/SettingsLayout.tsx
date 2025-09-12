/**
 * Node modules
 */
import {
  UserCircle,
  Settings,
  Palette,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router';

/**
 * Libs
 */
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/app/settings/account', icon: UserCircle, label: 'Account' },
  { to: '/app/settings/general', icon: Settings, label: 'General' },
  { to: '/app/settings/subscription', icon: CreditCard, label: 'Subscription' },
  { to: '/app/settings/theme', icon: Palette, label: 'Theme' },
  { to: '/app/settings/security', icon: ShieldCheck, label: 'Security' },
];

export const SettingsLayout = () => {
  const { pathname, state } = useLocation();

  const currentTitle = navItems.find(({ to }) => to === pathname)?.label;

  return (
    <div className='flex min-h-[60vh]'>
      <aside className='w-56 rounded-l-md border-r bg-[#ffefe5]/30 p-2 py-3'>
        <nav className='flex flex-col gap-1'>
          <h3 className='mx-2 mb-4 font-semibold'>Settings</h3>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              replace={true}
              state={{
                backgroundLocation: state?.backgroundLocation,
                originPath: state?.originPath,
              }}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm',
                  isActive
                    ? 'bg-[#ffefe5] text-[#a81f00]'
                    : 'hover:bg-accent/50',
                )
              }
            >
              <item.icon
                className='size-5'
                strokeWidth={1}
              />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className='flex-1'>
        <div className='border-b p-4 py-2.5 font-semibold'>{currentTitle}</div>
        <div className='scrollbar-track-transparent scrollbar-thumb-[#c1c1c1] hover:scrollbar-thumb-black/50 scrollbar-thin scrollbar-thumb-rounded-full max-h-[80vh] overflow-y-scroll p-4'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};
