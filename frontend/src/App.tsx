import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/-router'
import { useAuthStore } from "./store/auth.store"
import { initializeAuth } from "./services/auth.service"
import { useEffect } from 'react'

import './App.css'

function App() {
  const { isAuthenticated, isInitialized } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [])

  if (!isInitialized) {
    return (
      <div className="app-loading-container">
        <div className="app-loading-spinner" />
        <p className="app-loading-text">Loading PollFlow...</p>
      </div>
    )
  }

  return (
    <RouterProvider router={router} context={{ isAuthenticated, isInitialized }} />
  )
}

export default App
