/**
 * Node modules
 */
import { Bell } from 'lucide-react';
import { AddCircle } from 'iconsax-reactjs';
import { Link, useLocation } from 'react-router';

/**
 * Constants
 */
import { SIDEBAR_LINKS } from '@/constants/sidebar';

/**
 * Components
 */
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { HelpButton } from '@/components/HelpButton';
import { UserButton } from '@/components/UserButton';
import { TaskDialog } from '@/components/TaskDialog';

export const AppSidebar = () => {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarHeader className='flex flex-row items-center justify-between !px-3 !pt-2.5'>
        <UserButton />
        <div className='space-x-2'>
          <Button
            size='icon'
            variant='ghost'
            className='hover:bg-sidebar-accent size-8 rounded-sm'
          >
            <Bell className='size-5 stroke-1' />
          </Button>
          <SidebarTrigger />
        </div>
      </SidebarHeader>
      <SidebarContent className='px-1.5'>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <TaskDialog>
                  <SidebarMenuButton
                    size='lg'
                    className='gap-1 [&>svg]:size-7'
                  >
                    <AddCircle
                      variant='Bold'
                      className='text-primary'
                    />
                    <span className='font-medium text-[#a81f00]'>Add task</span>
                  </SidebarMenuButton>
                </TaskDialog>
              </SidebarMenuItem>
              {SIDEBAR_LINKS.map((link) => {
                const isActive = location.pathname.startsWith(link.href);
                const IconComponent = link.icon;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      asChild
                      className='px-2 data-[active=true]:bg-[#ffefe5] data-[active=true]:font-normal [&>svg]:size-5'
                    >
                      <Link
                        to={link.href}
                        className='h-full'
                      >
                        <IconComponent
                          variant={isActive ? 'Bold' : 'Outline'}
                          className={
                            isActive
                              ? 'text-primary'
                              : 'text-sidebar-foreground'
                          }
                        />
                        <span
                          className={isActive ? 'text-[#a81f00]' : 'text-black'}
                        >
                          {link.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className='font-normal opacity-60 peer-data-[active=true]/menu-button:text-[#dc4c3e]'>
                      2
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className='!px-3'>
        <HelpButton />
      </SidebarFooter>
    </Sidebar>
  );
};
