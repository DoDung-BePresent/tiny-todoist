/**
 * Node modules
 */
import { lazy } from 'react';
import { createBrowserRouter, Navigate, type RouteObject } from 'react-router';

/**
 * Layouts
 */
import AppLayout from '@/layouts/AppLayout';
import BaseLayout from '@/layouts/BaseLayout';
import AuthLayout from '@/layouts/AuthLayout';

/**
 * Components
 */
import { GuestRoute } from './components/GuestRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LazyWrapper } from './components/LazyWrapper';

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
import { PageLoader } from '@/components/PageLoader';

const GithubCallbackPage = lazy(
  () => import('@/pages/auth/GithubCallbackPage'),
);
const CompletedPage = lazy(() => import('@/pages/app/CompletedPage'));
const ProjectPage = lazy(() => import('@/pages/app/ProjectPage'));
const SettingsDialog = lazy(() => import('@/components/SettingsDialog'));
const AccountSettings = lazy(() => import('@/pages/setting/AccountSetting'));

const rootRoutesChildren: RouteObject[] = [
  {
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: (
          <LazyWrapper>
            <HomePage />
          </LazyWrapper>
        ),
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/auth/callback',
    element: (
      <LazyWrapper>
        <GithubCallbackPage />
      </LazyWrapper>
    ),
  },
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
    element: (
      <LazyWrapper fallback={<PageLoader />}>
        <CompletedPage />
      </LazyWrapper>
    ),
  },
  {
    path: 'projects/:id',
    element: (
      <LazyWrapper fallback={<PageLoader />}>
        <ProjectPage />
      </LazyWrapper>
    ),
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
      {
        path: 'account',
        element: <AccountSettings />,
      },
      { path: '*', element: <h2>Coming soon</h2> },
    ],
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <GuestRoute />,
    errorElement: <RootErrorBoundary />,
    children: rootRoutesChildren,
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
