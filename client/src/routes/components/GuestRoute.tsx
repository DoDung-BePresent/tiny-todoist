/**
 * Node modules
 */
import { Navigate, Outlet } from 'react-router';

/**
 * Stores
 */
import { useAuthStore } from '@/stores/auth';

export const GuestRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return (
      <Navigate
        to='/app/today'
        replace
      />
    );
  }
  return <Outlet />;
};
