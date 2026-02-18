import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { AuthContextProvider } from './context/AuthContext'
import { ProfileContextProvider } from './context/ProfileContext'
import 'leaflet/dist/leaflet.css';
import { Analytics } from "@vercel/analytics/react"
import { Toaster } from "@/components/ui/sonner"
const root = document.getElementById('root')! as HTMLElement
createRoot(root).render(
  <StrictMode>
    <AuthContextProvider>
      <ProfileContextProvider>
        <RouterProvider router={router}></RouterProvider>
        <Analytics />
        <Toaster />
      </ProfileContextProvider>
    </AuthContextProvider>
  </StrictMode >,
)
