import { Navigate, Outlet, useLocation } from 'react-router'
import Cargando from '@/components/Cargando/Cargando'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from './paths'

/**
 * Envuelve las rutas que requieren sesión iniciada. Sin sesión manda al login
 * recordando a dónde quería ir el usuario (LoginPage lo lee de state.desde y
 * vuelve ahí después de ingresar).
 *
 * Al abrir la app (o con F5) el front todavía no sabe si la cookie de sesión es
 * válida: mientras el back responde GET /api/usuarios/me muestra un spinner, así
 * no manda al login a alguien que sí tiene sesión.
 */
export default function RutaPrivada() {
  const { estaLogueado, verificandoSesion } = useAuth()
  const location = useLocation()

  if (verificandoSesion) return <Cargando texto="Recuperando tu sesión…" />
  if (!estaLogueado) return <Navigate to={PATHS.login} replace state={{ desde: location }} />
  return <Outlet />
}
