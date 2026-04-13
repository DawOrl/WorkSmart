import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from '@/pages/LandingPage';
import AuthPage from '@/pages/AuthPage';
import DashboardPage from '@/pages/DashboardPage';
import CVPage from '@/pages/CVPage';
import JobsPage from '@/pages/JobsPage';
import JobDetailPage from '@/pages/JobDetailPage';
import TrackerPage from '@/pages/TrackerPage';
import AlertsPage from '@/pages/AlertsPage';
import LetterWriterPage from '@/pages/LetterWriterPage';
import PricingPage from '@/pages/PricingPage';
import SettingsPage from '@/pages/SettingsPage';
import NotFoundPage from '@/pages/NotFoundPage';
import PageLayout from '@/components/layout/PageLayout';

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/auth', element: <AuthPage /> },
  { path: '/pricing', element: <PricingPage /> },
  {
    element: <ProtectedRoute><PageLayout /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/cv', element: <CVPage /> },
      { path: '/jobs', element: <JobsPage /> },
      { path: '/jobs/:id', element: <JobDetailPage /> },
      { path: '/tracker', element: <TrackerPage /> },
      { path: '/alerts', element: <AlertsPage /> },
      { path: '/letter', element: <LetterWriterPage /> },
      { path: '/settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
