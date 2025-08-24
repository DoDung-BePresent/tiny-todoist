/**
 * Node modules
 */
import { Navigate, Outlet } from 'react-router';

/**
 * Stores
 */
import { useAuthStore } from '@/stores/auth';

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }
  return <Outlet />;
};
