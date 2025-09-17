/**
 * Node modules
 */
import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className='flex h-[calc(100vh-60px)] w-full items-center justify-center p-10'>
      <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
    </div>
  );
}
