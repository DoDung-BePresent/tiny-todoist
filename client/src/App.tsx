/**
 * Node modules
 */
import { useEffect } from 'react';
import { RouterProvider } from 'react-router';

/**
 * Routes
 */
import router from '@/routes';

/**
 * Stores
 */
import { useAuthStore } from '@/stores/auth';

/**
 * Services
 */
import { authService } from '@/services/authService';

/**
 * Components
 */
import { LoadingSpinner } from '@/components/LoadingSpinner';

const App = () => {
  const { setAuth, clearAuth, setInitialized, isInitialized } = useAuthStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await authService.getProfile();
        setAuth({
          accessToken: useAuthStore.getState().accessToken!,
          user: response.data.user,
        });
      } catch (error) {
        clearAuth();
        console.error('Authentication initialization failed:', error);
      } finally {
        setInitialized(true);
      }
    };
    initializeAuth();
  }, [setAuth, clearAuth, setInitialized]);

  if (!isInitialized) {
    return <LoadingSpinner />;
  }
  return <RouterProvider router={router} />;
};

export default App;
