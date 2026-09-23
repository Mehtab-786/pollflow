import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/router'
import { useAuthStore } from "./store/auth.store";


function App() {
  const auth = useAuthStore().isAuthenticated
  return (
    <RouterProvider router={router} context={{ isAuthenticated: auth }} />
  )

}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
