import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from "sonner";

const queryClient = new QueryClient()


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster
        duration={2000}
        position='top-right'
        richColors
        visibleToasts={2}
        closeButton
      />
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
