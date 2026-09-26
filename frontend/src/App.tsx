import { RouterProvider } from '@tanstack/react-router'
import { router } from './routes/-router'
import { useAuthStore } from "./store/auth.store"
import { initializeAuth } from "./services/auth.service"
import { useEffect } from 'react'

function App() {
  const { isAuthenticated, isInitialized } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [])

  if (!isInitialized) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: '16px',
        backgroundColor: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          border: '3px solid #e2e8f0',
          borderTopColor: '#3b82f6',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <p style={{ color: '#64748b', fontSize: '14px', margin: 0, fontWeight: 500 }}>
          Loading PollFlow...
        </p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <RouterProvider router={router} context={{ isAuthenticated, isInitialized }} />
  )
}

export default App
