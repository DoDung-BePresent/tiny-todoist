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
import RootErrorBoundary from '@/pages/RootErrorBoundary';
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
import CompletedPage from '@/pages/app/CompletedPage';
import ProjectPage from '@/pages/app/ProjectPage';

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
  {
    path: 'completed',
    element: <CompletedPage />,
  },
  {
    path: 'projects/:id',
    element: <ProjectPage />,
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <GuestRoute />,
    errorElement: <RootErrorBoundary />,
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
    errorElement: <RootErrorBoundary />,
    children: [
      {
        element: <AppLayout />,
        children: appRoutesChildren,
      },
    ],
  },
]);

export default router;
