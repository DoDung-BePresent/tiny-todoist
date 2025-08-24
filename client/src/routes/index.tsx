/**
 * Node modules
 */
import { createBrowserRouter } from 'react-router';

/**
 * Pages
 */
import HomePage from '@/pages/HomePage';
import InboxPage from '@/pages/app/InboxPage';
import TodayPage from '@/pages/app/TodayPage';
import LoginPage from '@/pages/auth/LoginPage';
import UpcomingPage from '@/pages/app/UpcomingPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import GithubCallbackPage from '@/pages/auth/GithubCallbackPage';

/**
 * Layouts
 */
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';

/**
 * Types
 */
import type { RouteObject } from 'react-router';

import { GuestRoute } from './components/GuestRoute';
import { ProtectedRoute } from './components/ProtectedRoute';

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
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: rootRoutesChildren,
      },
    ],
  },
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: appRoutesChildren,
      },
    ],
  },
]);

export default router;
