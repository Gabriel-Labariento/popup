import { createBrowserRouter } from "react-router-dom";
import { OnboardingPage } from "./components/onboarding/Onboarding";
import { LoginPage } from "./components/login-page";
import { HostDashboard } from "./components/host/Dashboard";
import { VendorDashboard } from "./components/vendor/Dashboard";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

export const router = createBrowserRouter([
  { path: '/', element: <OnboardingPage></OnboardingPage>},
  { path: '/login', element: <LoginPage></LoginPage> },
  {
    element: <Layout></Layout>,
    children: [
        { path: '/host/dashboard', element: <PrivateRoute><HostDashboard></HostDashboard></PrivateRoute>},
        { path: '/vendor/dashboard', element: <PrivateRoute><VendorDashboard></VendorDashboard></PrivateRoute>}
    ]
  }]
)