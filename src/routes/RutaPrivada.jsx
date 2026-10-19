import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from './paths'

/**
 * Envuelve las rutas que requieren sesión iniciada. Sin sesión manda al login
 * recordando a dónde quería ir el usuario (LoginPage lo lee de state.desde y
 * vuelve ahí después de ingresar).
 */
export default function RutaPrivada() {
  const { estaLogueado } = useAuth()
  const location = useLocation()

  if (!estaLogueado) return <Navigate to={PATHS.login} replace state={{ desde: location }} />
  return <Outlet />
}
