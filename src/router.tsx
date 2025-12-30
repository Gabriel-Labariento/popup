import { createBrowserRouter, Navigate } from "react-router-dom";
import { OnboardingPage } from "./components/onboarding/Onboarding";
import { LoginPage } from "./components/login-page";
import { HostDashboard } from "./components/host/Dashboard";
import { VendorDashboard } from "./components/vendor/Dashboard";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import { RoleGuard } from "./components/RoleGuard";
import ProfilePage from "./components/ProfilePage";
import { UserAuth } from "./context/AuthContext";

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
          { path: 'profile', element: <ProfilePage /> }, // Works for host/profile
          // { path: 'events/create', element: <CreateEvent /> },
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
  // --- CATCH ALL ---
  { path: '*', element: <Navigate to="/" replace /> }
]);

