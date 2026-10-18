import { Outlet } from 'react-router'

/**
 * Envuelve las rutas que requieren sesión iniciada.
 *
 * Por ahora deja pasar a todos para poder navegar el esqueleto.
 * TODO (auth): cuando exista el AuthContext, si no hay token redirigir al login
 * recordando a dónde quería ir el usuario:
 *   const location = useLocation()
 *   if (!token) return <Navigate to={PATHS.login} replace state={{ desde: location }} />
 */
export default function RutaPrivada() {
  return <Outlet />
}
