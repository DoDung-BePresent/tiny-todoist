import type { PropsWithChildren } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { TaskCardSkeleton } from '@/components/TaskCard';

const Page = ({ children }: PropsWithChildren) => {
  return (
    <div className='container mx-auto md:max-w-screen-lg md:px-4 lg:px-28!'>
      {children}
    </div>
  );
};

const PageSkeleton = () => {
  return (
    <div className='container mx-auto md:max-w-screen-lg md:px-4 lg:px-28!'>
      <div className='space-y-2 pt-5 pb-3'>
        <Skeleton className='h-10 w-64' />
        <div className='pt-2'>
          {Array.from({ length: 5 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

const PageHeader = ({ children }: PropsWithChildren) => {
  return <div className='space-y-2 pt-5 pb-3'>{children}</div>;
};

const PageTitle = ({ children }: PropsWithChildren) => {
  return <h1 className='text-[26px] font-bold'>{children}</h1>;
};

const PageList = ({ children }: PropsWithChildren) => {
  return <div className='pb-2'>{children}</div>;
};

export { Page, PageHeader, PageTitle, PageList, PageSkeleton };
