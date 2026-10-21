import { useContext } from 'react'
import { AuthContext } from '@/context/contextoAuth'

/**
 * Sesión del usuario logueado.
 * @returns {{
 *   usuario: { id: number, nombreUsuario: string, mail: string, nombre: string, apellido: string,
 *              fechaNacimiento: string, sexo: string, rol: 'USUARIO' | 'ADMIN' } | null,
 *   token: string | null,
 *   estaLogueado: boolean,
 *   esAdmin: boolean,
 *   login: (mail: string, contrasena: string) => Promise<object>,
 *   logout: () => void,
 *   actualizarSesion: (usuario: object) => void,
 * }}
 */
export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) throw new Error('useAuth tiene que usarse dentro de <AuthProvider>')
  return contexto
}
