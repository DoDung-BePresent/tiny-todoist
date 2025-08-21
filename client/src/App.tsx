/**
 * Node modules
 */
import { RouterProvider } from 'react-router';

/**
 * Routes
 */
import router from '@/routes';

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
