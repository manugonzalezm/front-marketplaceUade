import { Outlet } from 'react-router'

/**
 * Envuelve las rutas de administración. Va siempre dentro de <RutaPrivada>,
 * así que acá ya se asume que hay sesión.
 *
 * Por ahora deja pasar a todos para poder navegar el esqueleto.
 * TODO (auth): si usuario.rol !== 'ADMIN', redirigir al inicio:
 *   return <Navigate to={PATHS.inicio} replace />
 */
export default function RutaAdmin() {
  return <Outlet />
}
