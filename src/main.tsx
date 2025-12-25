import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider} from 'react-router-dom'
import { router } from './router'
import { AuthContextProvider } from './context/AuthContext'

const root = document.getElementById('root')! as HTMLElement
createRoot(root).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router}></RouterProvider>
    </AuthContextProvider>
  </StrictMode>,
)
