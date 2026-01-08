import { createBrowserRouter, Navigate } from "react-router-dom";
import { OnboardingPage } from "./components/onboarding/Onboarding";
import { LoginPage } from "./components/login-page";
import { HostDashboard } from "./components/host/Dashboard";
import { VendorDashboard } from "./components/vendor/Dashboard";
import Layout from "./components/Layout";
import { RoleGuard } from "./components/RoleGuard";
import ProfilePage from "./components/ProfilePage";
import CreateEventPage from "./components/host/CreateEventPage";
import EditEventPage from "./components/host/EditEventPage";
import ApplyEventPage from "./components/vendor/ApplyEventPage";
import ReviewApplicationsPage from "./components/host/ReviewApplicationsPage";
import VendorApplicationsPage from "./components/vendor/ApplicationsPage";
import EventDetailsPage from "./components/vendor/EventDetailsPage";
import HostChatPage from "./components/host/HostChatPage";
import VendorChatPage from "./components/vendor/VendorChatPage";

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  { path: '/', element: <OnboardingPage /> },
  { path: '/login', element: <LoginPage /> },

  // --- HOST ROUTES ---
  {
    path: '/host',
    element: (
      <RoleGuard allowedRole="HOST" />
    ),
    children: [
      {
        element: <Layout />, // TODO: Specialized layout with Host Sidebar
        children: [
          { path: 'dashboard', element: <HostDashboard /> },
          { path: 'profile', element: <ProfilePage /> },
          { path: 'events/create', element: <CreateEventPage /> },
          { path: 'events/edit/:id', element: <EditEventPage /> },
          { path: 'events/:id/review', element: <ReviewApplicationsPage /> },
          { path: 'messages/:applicationId', element: <HostChatPage /> }
        ]
      }
    ]
  },

  // --- VENDOR ROUTES ---
  {
    path: '/vendor',
    element: (
      <RoleGuard allowedRole="VENDOR" />
    ),
    children: [
      {
        element: <Layout />, // TODO: Specialized layout with Vendor Sidebar
        children: [
          { path: 'dashboard', element: <VendorDashboard /> },
          { path: 'profile', element: <ProfilePage /> }, // Works for vendor/profile
          { path: 'events/:id/apply', element: <ApplyEventPage /> },
          { path: 'applications', element: <VendorApplicationsPage /> },
          { path: 'messages/:applicationId', element: <VendorChatPage /> },
          { path: '/vendor/events/:id', element: <EventDetailsPage /> }
        ]
      }
    ]
  },

  {
    path: '/dashboard',
    element: <RoleGuard allowedRole={undefined}></RoleGuard>
  },
  // --- CATCH ALL ---
  { path: '*', element: <Navigate to="/dashboard" replace /> }
]);

