/**
 * Node modules
 */
import { Suspense } from 'react';

/**
 * Components
 */
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const LazyWrapper = ({
  children,
  fallback = <LoadingSpinner />,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) => <Suspense fallback={fallback}>{children}</Suspense>;
