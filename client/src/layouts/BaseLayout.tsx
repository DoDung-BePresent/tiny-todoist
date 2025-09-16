/**
 * Node modules
 */
import { Menu, XIcon } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';

/**
 * Hooks
 */
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Components
 */
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const menuItems = [
  {
    title: 'Your goal',
    items: [
      'Task management',
      'Project management',
      'Time management',
      'Habit Creation',
      'Teamwork',
    ],
  },
  {
    title: 'Resources',
    items: [
      'Integrations',
      'Models',
      'Discover',
      'Help Center',
      'Productivity Methods + Quiz',
      'Inspiration',
      'Downloads',
    ],
  },
];

const BaseLayout = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className='bg-[#fefdfc]'>
        <header className='flex items-center justify-between border-b px-6 py-4'>
          <Logo />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
              >
                <Menu
                  className='size-6'
                  strokeWidth={1.5}
                />
              </Button>
            </SheetTrigger>
            <SheetContent
              showCloseButton={false}
              side='top'
            >
              <SheetHeader className='flex-row items-center justify-between border-b p-6 py-4'>
                <Logo />
                <SheetClose>
                  <Button
                    variant='ghost'
                    size='icon'
                  >
                    <XIcon
                      className='size-6'
                      strokeWidth={1.5}
                    />
                  </Button>
                </SheetClose>
              </SheetHeader>
              <div className='scrollbar-thin max-h-96 flex-1 overflow-y-auto [scrollbar-gutter:stable]'>
                <Accordion
                  type='multiple'
                  className='w-full space-y-2 overflow-y-auto p-2 pr-0'
                >
                  {menuItems.map((menu) => (
                    <AccordionItem
                      key={menu.title}
                      value={menu.title}
                      className='border-none'
                    >
                      <AccordionTrigger
                        iconPosition='right'
                        className='hover:bg-accent data-[state=open]:bg-accent rounded-md border-none px-4 py-4 pt-2 text-lg font-normal text-black [&>svg]:mt-1 [&>svg]:ml-auto [&>svg]:rotate-0 [&>svg]:stroke-2 [&>svg]:text-black [&>svg]:duration-300 [&[data-state=open]>svg]:rotate-180'
                      >
                        {menu.title}
                      </AccordionTrigger>
                      <AccordionContent className='pb-0'>
                        <ul className='mt-2 space-y-2 pl-5'>
                          {menu.items &&
                            menu.items.map((item) => (
                              <li key={item}>
                                <a
                                  href='#'
                                  className='hover:bg-accent block rounded-md px-4 py-2 text-lg text-black'
                                >
                                  {item}
                                </a>
                              </li>
                            ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
                <a
                  href='#'
                  className='hover:bg-accent mx-2 block rounded-md px-4 py-2 text-lg text-black'
                >
                  Rates
                </a>
              </div>
              <div className='flex w-full items-center justify-between gap-4 border-t p-6'>
                <Button
                  variant='secondary'
                  size='lg'
                  onClick={() => navigate('/login')}
                  className='flex-1 text-lg'
                >
                  Login
                </Button>
                <Button
                  size='lg'
                  onClick={() => navigate('/register')}
                  className='flex-1 text-lg'
                >
                  Try it for free
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className='container'>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className='bg-[#fefdfc]'>
      <div className='container'>
        <header className='flex items-center justify-between py-4'>
          <Logo />
          <div className='flex items-center gap-4'>
            <Button
              variant={'ghost'}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button onClick={() => navigate('/register')}>
              Try it for free
            </Button>
          </div>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BaseLayout;
