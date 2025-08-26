import type { PropsWithChildren } from 'react';

const Page = ({ children }: PropsWithChildren) => {
  return (
    <div className='container mx-auto md:max-w-screen-lg md:px-4 lg:px-28!'>
      {children}
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

export { Page, PageHeader, PageTitle, PageList };
