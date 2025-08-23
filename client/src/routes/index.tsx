/**
 * Node modules
 */
import { createBrowserRouter } from 'react-router';

/**
 * Pages
 */
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import InboxPage from '@/pages/app/InboxPage';
import TodayPage from '@/pages/app/TodayPage';
import UpcomingPage from '@/pages/app/UpcomingPage';
import GithubCallbackPage from '@/pages/auth/GithubCallbackPage';

/**
 * Layouts
 */
import AppLayout from '@/layouts/AppLayout';
import RootLayout from '@/layouts/RootLayout';

/**
 * Types
 */
import type { RouteObject } from 'react-router';
import HomePage from '@/pages/HomePage';

const rootRoutesChildren: RouteObject[] = [
  {
    index: true,
    element: <HomePage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: 'login',
    element: <LoginPage />,
  },
  { path: '/auth/callback', element: <GithubCallbackPage /> },
];

const appRoutesChildren: RouteObject[] = [
  {
    path: 'inbox',
    element: <InboxPage />,
  },
  {
    path: 'today',
    element: <TodayPage />,
  },
  {
    path: 'upcoming',
    element: <UpcomingPage />,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: rootRoutesChildren,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: appRoutesChildren,
  },
]);

export default router;
