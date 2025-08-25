/**
 * Node modules
 */
import { isRouteErrorResponse, Link, useRouteError } from 'react-router';

/**
 * Components
 */
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';

/**
 * Assets
 */
import staticErrors from '@/assets/static_errors.avif';

const RootErrorBoundary = () => {
  const error = useRouteError();
  return (
    <div className='container mx-auto flex min-h-screen flex-col'>
      <Header />
      <div className='flex grow flex-col items-center justify-center'>
        <h1 className='text-center text-2xl font-bold sm:text-4xl'>
          {isRouteErrorResponse(error)
            ? "Hmmm, that page doesn't exist."
            : 'Something went wrong.'}
        </h1>
        <p className='text-muted-foreground mx-w-[55ch] mt-4 mb-6 text-center sm:text-lg'>
          {isRouteErrorResponse(error)
            ? 'You can get back on track and manage your tasks with ease.'
            : "We're working on fixing this issue. Please try again later."}
        </p>
        <div className='flex gap-2'>
          <Button asChild>
            <Link to='/'> Return to Home</Link>
          </Button>
          <Button
            asChild
            variant='ghost'
          >
            <Link to='/app/inbox'>View Inbox</Link>
          </Button>
        </div>
        <figure className='mt-24'>
          <img
            src={staticErrors}
            alt='Static Errors'
            className='w-[450px]'
          />
        </figure>
      </div>
    </div>
  );
};

export default RootErrorBoundary;
