import '@fontsource-variable/figtree'
import '@/styles/tokens.css'
import '@/styles/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { store } from '@/store/store'
import { verificarSesion } from '@/store/slices/authSlice'
import AppRouter from '@/routes/AppRouter'

// F5 o primera visita: si el navegador tiene la cookie de sesión, el back devuelve el
// usuario y authSlice recupera la sesión (ver docs/persistencia-sesion.md).
store.dispatch(verificarSesion())

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
