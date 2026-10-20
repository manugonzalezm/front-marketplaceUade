import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from './paths'

/**
 * Envuelve las rutas de administración. Va siempre dentro de <RutaPrivada>,
 * así que acá ya se asume que hay sesión. Si el usuario no es ADMIN, vuelve al inicio.
 */
export default function RutaAdmin() {
  const { esAdmin } = useAuth()

  if (!esAdmin) return <Navigate to={PATHS.inicio} replace />
  return <Outlet />
}
