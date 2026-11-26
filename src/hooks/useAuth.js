import { useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cerrarSesion, iniciarSesion, usuarioActualizado } from '@/store/slices/authSlice'

/**
 * Sesión del usuario logueado. Lee de store.auth (authSlice) y despacha sus acciones.
 * El token no aparece: viaja en una cookie HttpOnly que el front no puede leer.
 *
 * @returns {{
 *   usuario: { id: number, nombreUsuario: string, mail: string, nombre: string, apellido: string,
 *              fechaNacimiento: string, sexo: string, rol: 'USUARIO' | 'ADMIN' } | null,
 *   estaLogueado: boolean,
 *   esAdmin: boolean,
 *   verificandoSesion: boolean,
 *   login: (mail: string, contrasena: string) => Promise<object>,
 *   logout: () => void,
 *   actualizarSesion: (usuario: object) => void,
 * }}
 *   verificandoSesion es true al abrir la app (o con F5) hasta que el back confirma si la
 *   cookie de sesión sigue siendo válida.
 */
export function useAuth() {
  const dispatch = useDispatch()
  const usuario = useSelector((store) => store.auth.usuario)
  const estado = useSelector((store) => store.auth.estado)

  // unwrap() devuelve el usuario o tira el error del back (error.message listo para mostrar)
  const login = useCallback(
    (mail, contrasena) => dispatch(iniciarSesion({ mail, contrasena })).unwrap(),
    [dispatch],
  )
  const logout = useCallback(() => {
    dispatch(cerrarSesion())
  }, [dispatch])
  const actualizarSesion = useCallback((nuevo) => dispatch(usuarioActualizado(nuevo)), [dispatch])

  return useMemo(
    () => ({
      usuario,
      estaLogueado: Boolean(usuario),
      esAdmin: usuario?.rol === 'ADMIN',
      verificandoSesion: estado === 'verificando',
      login,
      logout,
      actualizarSesion,
    }),
    [usuario, estado, login, logout, actualizarSesion],
  )
}
