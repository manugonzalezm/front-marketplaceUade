import { apiFetch } from './client'

// Módulo del recurso usuarios. Las funciones devuelven los DTO tal cual los manda
// el back. Quien haga el perfil y la administración de usuarios suma acá
// getUsuario, getUsuarios, actualizarUsuario y eliminarUsuario.

/**
 * POST /api/usuarios/login { mail, contrasena } -> { usuario, token }
 * `usuario` es el UsuarioResponseDTO:
 *   { id, nombreUsuario, mail, nombre, apellido, fechaNacimiento, sexo, rol }
 */
export const login = ({ mail, contrasena }) =>
  apiFetch('/usuarios/login', { method: 'POST', body: { mail, contrasena } })

/**
 * POST /api/usuarios/registro
 *   { nombreUsuario, mail, contrasena, nombre, apellido,
 *     fechaNacimiento: 'AAAA-MM-DD', sexo: 'MASCULINO' | 'FEMENINO' | 'OTRO' }
 * -> UsuarioResponseDTO (sin token: después hay que loguearse)
 */
export const registrarUsuario = (usuario) => apiFetch('/usuarios/registro', { method: 'POST', body: usuario })
