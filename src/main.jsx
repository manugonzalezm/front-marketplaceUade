import '@fontsource-variable/figtree'
import '@/styles/tokens.css'
import '@/styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { AuthProvider } from '@/context/AuthContext'
import AppRouter from '@/routes/AppRouter'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)