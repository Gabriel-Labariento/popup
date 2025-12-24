import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, RouterProvider} from 'react-router-dom'
import { OnboardingPage } from './components/onboarding/Onboarding.tsx'
import { LoginPage } from './components/login-page.tsx'


const router = createBrowserRouter([
  {
    path: '/',
    element: <OnboardingPage></OnboardingPage>
  },
  {
    path: '/login',
    element: <LoginPage onBack={function (): void {
      throw new Error('Function not implemented.')
    } } onSignUp={function (): void {
      throw new Error('Function not implemented.')
    } }></LoginPage>
  },
  {
    path: '/host/dashboard',
    element: <div>This is the host dashboard</div>
  },
  {
    path: '/vendor/dashboard',
    element: <div>This is the vendor dashboard</div>
  }

]);

const root = document.getElementById('root')! as HTMLElement
createRoot(root).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
