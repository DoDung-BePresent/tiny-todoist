/**
 * Node modules
 */
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useSearchParams, useNavigate } from 'react-router';

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

const GithubCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    const token = searchParams.get('token');

    const handleAuth = async (accessToken: string) => {
      try {
        setAuth({ accessToken, user: null });

        const userProfile = await authService.getProfile();

        setAuth({ accessToken, user: userProfile.data.user });

        toast.success('Welcome!');
        navigate('/app/today', { replace: true });
      } catch (error) {
        toast.error('Authentication failed. Please try again.');
        navigate('/login', { replace: true });
      }
    };

    if (token) {
      handleAuth(token);
    } else {
      toast.error('Invalid authentication callback.');
      navigate('/login', { replace: true });
    }
  }, [searchParams]);

  return <LoadingSpinner />;
};

export default GithubCallbackPage;
