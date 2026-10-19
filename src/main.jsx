import '@fontsource-variable/figtree'
import '@/styles/tokens.css'
import '@/styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { AuthProvider } from '@/context/AuthContext'
import AppRouter from '@/routes/AppRouter'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
