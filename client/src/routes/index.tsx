/**
 * Node modules
 */
import { createBrowserRouter, Navigate } from 'react-router';

/**
 * Layouts
 */
import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';

/**
 * Types
 */
import type { RouteObject } from 'react-router';

/**
 * Components
 */
import { GuestRoute } from './components/GuestRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { SettingsDialog } from '@/components/SettingsDialog';

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
import CompletedPage from '@/pages/app/CompletedPage';
import ProjectPage from '@/pages/app/ProjectPage';
import { AccountSettings } from '@/pages/setting/AccountSetting';

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
  {
    path: 'settings',
    element: <SettingsDialog />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to='account'
            replace
          />
        ),
      },
      { path: 'account', element: <AccountSettings /> },
      { path: '*', element: <h2>Coming soon</h2> },
    ],
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
