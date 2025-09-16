/**
 * Node modules
 */
import {
  Bell,
  ChevronRightIcon,
  EllipsisIcon,
  HashIcon,
  PlusIcon,
} from 'lucide-react';
import { AddCircle } from 'iconsax-reactjs';
import { Link, useLocation, useParams } from 'react-router';

/**
 * Constants
 */
import { SIDEBAR_LINKS } from '@/constants/sidebar';

/**
 * Hooks
 */
import { useTaskStatsQuery } from '@/hooks/useTasks';
import { useProjectsQuery } from '@/hooks/useProject';

/**
 * Components
 */
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ProjectDialog } from '@/components/ProjectDialog';
import { ProjectDropdownMenu } from '@/components/ProjectDropdownMenu';

export const AppSidebar = () => {
  const location = useLocation();
  const { stats } = useTaskStatsQuery();
  const { projects } = useProjectsQuery();
  const { id } = useParams();

  const getCountForLink = (href: string) => {
    if (href.includes('today')) return stats?.today;
    if (href.includes('upcoming')) return stats?.upcoming;
    if (href.includes('inbox')) return stats?.inbox;
    if (href.includes('completed')) return stats?.completed;
    return 0;
  };

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
                    className='!h-8.5 gap-1 [&>svg]:size-7'
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
                const count = getCountForLink(link.href) || 0;
                return (
                  <SidebarMenuItem key={link.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      asChild
                      className='!h-8.5 px-2 data-[active=true]:bg-[#ffefe5] data-[active=true]:font-normal [&>svg]:size-5'
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
                    {count > 0 && (
                      <SidebarMenuBadge className='font-normal opacity-60 peer-data-[active=true]/menu-button:text-[#dc4c3e]'>
                        {count}
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Collapsible className='group/collapsible'>
          <SidebarGroup className='gap-2'>
            <SidebarGroupLabel asChild>
              <div className='hover:bg-sidebar-accent group-data-[state=open]/collapsible:text-primary !h-8.5 !text-sm'>
                My Projects
                <ProjectDialog>
                  <Button
                    variant='ghost'
                    className='text-muted-foreground ml-auto size-7 rounded-sm hover:bg-black/5'
                  >
                    <PlusIcon />
                  </Button>
                </ProjectDialog>
                <CollapsibleTrigger>
                  <Button
                    variant='ghost'
                    className='text-muted-foregrounds size-7 rounded-sm hover:bg-black/5'
                  >
                    <ChevronRightIcon className='text-muted-foreground transition-all duration-150 ease-in-out group-data-[state=open]/collapsible:rotate-90' />
                  </Button>
                </CollapsibleTrigger>
              </div>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {projects?.map((project) => (
                    <SidebarMenuItem key={project.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={`${project.name}-${project.id}` === `${id}`}
                        className='group/side-bar-button !h-8.5 px-2 data-[active=true]:bg-[#ffefe5] data-[active=true]:font-normal'
                      >
                        <Link to={`projects/${project.name}-${project.id}`}>
                          <HashIcon
                            strokeWidth={1.5}
                            color={project.color}
                          />
                          <span className='flex-1 truncate'>
                            {project.name}
                          </span>
                          <ProjectDropdownMenu project={project}>
                            <Button
                              variant='ghost'
                              className='text-muted-foreground size-7 rounded-sm opacity-0 group-hover/side-bar-button:opacity-100 hover:bg-black/5 data-[state=open]:bg-black/5 data-[state=open]:opacity-100'
                            >
                              <EllipsisIcon strokeWidth={1.5} />
                            </Button>
                          </ProjectDropdownMenu>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter className='!px-3'>
        <HelpButton />
      </SidebarFooter>
    </Sidebar>
  );
};
