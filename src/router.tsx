
import { createBrowserRouter } from "react-router-dom";
import { OnboardingPage } from "./components/onboarding/Onboarding";
import { LoginPage } from "./components/login-page";
import { ForgotPassword } from "./components/forgot-password";
import { UpdatePassword } from "./components/update-password";
import { HowItWorks } from "./components/onboarding/how-it-works";
import { HostDashboard } from "./components/host/Dashboard";
import { VendorDashboard } from "./components/vendor/Dashboard";
import { RoleGuard } from "./components/RoleGuard";
import { ProfileGuard } from "./components/ProfileGuard";
import ProfilePage from "./components/ProfilePage";
import CreateEventPage from "./components/host/CreateEventPage";
import EditEventPage from "./components/host/EditEventPage";
import ApplyEventPage from "./components/vendor/ApplyEventPage.tsx";
import ReviewApplicationsPage from "./components/host/ReviewApplicationsPage";
import VendorApplicationsPage from "./components/vendor/ApplicationsPage";
import EventDetailsPage from "./components/vendor/EventDetailsPage";
import HostChatPage from "./components/host/HostChatPage";
import VendorChatPage from "./components/vendor/VendorChatPage";
import HostLayout from "./components/host/HostLayout";
import VendorLayout from "./components/vendor/VendorLayout";
import { GlobalError } from "./components/GlobalError";
import { NotFound } from "./components/NotFound";
import PrivacyPage from "./components/PrivacyPage";
import TermsPage from "./components/TermsPage";
import ContactPage from "./components/ContactPage";
import { PublicLayout } from "./components/PublicLayout";
import { ScamSafetyPage } from "./components/ScamSafetyPage";
import { AuthCallback } from "./components/auth/AuthCallback";
import { RoleSelectionPage } from "./components/auth/RoleSelectionPage";

export const router = createBrowserRouter([
  // --- PUBLIC ROUTES ---
  {
    path: '/',
    element: <OnboardingPage />,
    errorElement: <GlobalError />
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/update-password', element: <UpdatePassword /> },
  { path: '/how-it-works', element: <HowItWorks /> },
  { path: '/auth/callback', element: <AuthCallback /> },
  { path: '/select-role', element: <RoleSelectionPage /> },
  {
    element: <PublicLayout />,
    children: [
      { path: '/privacy', element: <PrivacyPage /> },
      { path: '/terms', element: <TermsPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/scam-safety', element: <ScamSafetyPage /> },
    ]
  },

  // --- HOST ROUTES ---
  {
    path: '/host',
    element: (
      <RoleGuard allowedRole="HOST" />
    ),
    errorElement: <GlobalError />,
    children: [
      {
        element: <ProfileGuard />, // Enforce profile completion
        children: [
          {
            element: <HostLayout />,
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
      }
    ]
  },

  // --- VENDOR ROUTES ---
  {
    path: '/vendor',
    element: (
      <RoleGuard allowedRole="VENDOR" />
    ),
    errorElement: <GlobalError />,
    children: [
      {
        element: <ProfileGuard />, // Enforce profile completion
        children: [
          {
            element: <VendorLayout />,
            children: [
              { path: 'dashboard', element: <VendorDashboard /> },
              { path: 'profile', element: <ProfilePage /> }, // Works for vendor/profile
              { path: 'events/:id/apply', element: <ApplyEventPage /> },
              { path: 'applications', element: <VendorApplicationsPage /> },
              { path: 'messages/:applicationId', element: <VendorChatPage /> },
              { path: 'events/:id', element: <EventDetailsPage /> }
            ]
          }
        ]
      }
    ]
  },

  {
    path: '/dashboard',
    element: <RoleGuard allowedRole={undefined}></RoleGuard>
  },
  // --- CATCH ALL ---
  { path: '*', element: <NotFound /> }
]);

