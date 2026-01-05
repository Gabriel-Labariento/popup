import { createBrowserRouter, Navigate } from "react-router-dom";
import { OnboardingPage } from "./components/onboarding/Onboarding";
import { LoginPage } from "./components/login-page";
import { HostDashboard } from "./components/host/Dashboard";
import { VendorDashboard } from "./components/vendor/Dashboard";
import Layout from "./components/Layout";
import { RoleGuard } from "./components/RoleGuard";
import ProfilePage from "./components/ProfilePage";
import CreateEventPage from "./components/host/CreateEventPage";
import path from "node:path";
import HostEventsPage from "./components/host/EventsPage";

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
          { path: 'create-event', element: <CreateEventPage />}
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
          // { path: 'discover', element: <EventDiscovery /> },
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

