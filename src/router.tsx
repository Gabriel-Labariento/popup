import { createBrowserRouter } from "react-router-dom";
import { OnboardingPage } from "./components/onboarding/Onboarding";
import { LoginPage } from "./components/login-page";

export const router = createBrowserRouter([
  { path: '/', element: <OnboardingPage></OnboardingPage>},
  { path: '/login', element: <LoginPage></LoginPage> },
  { path: '/host/dashboard', element: <div>This is the host dashboard</div>},
  { path: '/vendor/dashboard', element: <div>This is the vendor dashboard</div>}
]);