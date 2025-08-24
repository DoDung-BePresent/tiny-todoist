import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const TodayPage = () => {
  const { logout } = useAuth();
  return (
    <div>
      TodayPage
      <Button onClick={() => logout()}>Logout</Button>
    </div>
  );
};

export default TodayPage;
