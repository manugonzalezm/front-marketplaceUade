import { useCallback, useMemo, useState } from 'react'
import { TOKEN_STORAGE_KEY } from '@/api/client'
import { login as loginApi } from '@/api/usuarios'
import { AuthContext } from './contextoAuth'

export const USUARIO_STORAGE_KEY = 'marketplace.usuario'

/**
 * Devuelve true si el JWT ya venció (o no se puede leer). El back pone el
 * vencimiento en `exp` (segundos desde 1970); el token dura 24 h.
 * @param {string} token
 */
function tokenVencido(token) {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const { exp } = JSON.parse(atob(payload))
    return typeof exp === 'number' && exp * 1000 <= Date.now()
  } catch {
    return true
  }
}

function borrarSesionGuardada() {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
  localStorage.removeItem(USUARIO_STORAGE_KEY)
}

/** Lee la sesión guardada al abrir la app. Si el token venció, la descarta. */
function leerSesionGuardada() {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  const usuarioJson = localStorage.getItem(USUARIO_STORAGE_KEY)
  if (!token || !usuarioJson || tokenVencido(token)) {
    borrarSesionGuardada()
    return { token: null, usuario: null }
  }
  try {
    return { token, usuario: JSON.parse(usuarioJson) }
  } catch {
    borrarSesionGuardada()
    return { token: null, usuario: null }
  }
}

/**
 * Provee la sesión del usuario a toda la app (envuelve a AppRouter en main.jsx).
 * Se consume con el hook useAuth (src/hooks/useAuth.js):
 *   const { usuario, token, estaLogueado, esAdmin, login, logout } = useAuth()
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(leerSesionGuardada)

  /**
   * Pide el token al back y guarda la sesión. Si las credenciales son
   * incorrectas tira el ApiError del back (error.message listo para mostrar).
   */
  const login = useCallback(async (mail, contrasena) => {
    const { usuario, token } = await loginApi({ mail, contrasena })
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    localStorage.setItem(USUARIO_STORAGE_KEY, JSON.stringify(usuario))
    setSesion({ token, usuario })
    return usuario
  }, [])

  const logout = useCallback(() => {
    borrarSesionGuardada()
    setSesion({ token: null, usuario: null })
  }, [])

  const valor = useMemo(
    () => ({
      usuario: sesion.usuario,
      token: sesion.token,
      estaLogueado: Boolean(sesion.token),
      esAdmin: sesion.usuario?.rol === 'ADMIN',
      login,
      logout,
    }),
    [sesion, login, logout],
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}
