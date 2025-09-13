/**
 * Node modules
 */
import { Navigate, Outlet } from 'react-router';

/**
 * Hooks
 */
import { useAuth } from '@/hooks/useAuth';

/**
 * Components
 */
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const GuestRoute = () => {
  const { accessToken, isAuthLoading } = useAuth();

  if (isAuthLoading) {
    return <LoadingSpinner />;
  }

  if (accessToken) {
    return (
      <Navigate
        to='/app/today'
        replace
      />
    );
  }
  return <Outlet />;
};
