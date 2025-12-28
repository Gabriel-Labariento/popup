import { createBrowserRouter } from "react-router-dom";
import { OnboardingPage } from "./components/onboarding/Onboarding";
import { LoginPage } from "./components/login-page";
import { HostDashboard } from "./components/host/Dashboard";
import { VendorDashboard } from "./components/vendor/dashboard";

export const router = createBrowserRouter([
  { path: '/', element: <OnboardingPage></OnboardingPage>},
  { path: '/login', element: <LoginPage></LoginPage> },
  { path: '/host/dashboard', element: <HostDashboard></HostDashboard>},
  { path: '/vendor/dashboard', element: <VendorDashboard></VendorDashboard>}]
)