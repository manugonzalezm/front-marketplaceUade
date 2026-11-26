import { apiFetch } from './client'

// Módulo del recurso usuarios. Las funciones devuelven los DTO tal cual los manda
// el back. Quien haga el perfil y la administración de usuarios suma acá
// getUsuario, getUsuarios, actualizarUsuario y eliminarUsuario.

/**
 * POST /api/usuarios/login { mail, contrasena } -> { usuario }
 * `usuario` es el UsuarioResponseDTO:
 *   { id, nombreUsuario, mail, nombre, apellido, fechaNacimiento, sexo, rol }
 * El token NO viene en el body: el back lo pone en la cookie HttpOnly marketplace_token.
 */
export const login = ({ mail, contrasena }) =>
  apiFetch('/usuarios/login', { method: 'POST', body: { mail, contrasena } })

/**
 * GET /api/usuarios/me -> UsuarioResponseDTO del dueño de la cookie de sesión.
 * Se pide al abrir la app (o al apretar F5) para recuperar la sesión. 401 si no hay.
 */
export const getSesion = () => apiFetch('/usuarios/me')

/** POST /api/usuarios/logout -> 204. El back borra la cookie de sesión. */
export const logout = () => apiFetch('/usuarios/logout', { method: 'POST' })

/**
 * POST /api/usuarios/registro
 *   { nombreUsuario, mail, contrasena, nombre, apellido,
 *     fechaNacimiento: 'AAAA-MM-DD', sexo: 'MASCULINO' | 'FEMENINO' | 'OTRO' }
 * -> UsuarioResponseDTO (sin token: después hay que loguearse)
 */
export const registrarUsuario = (usuario) => apiFetch('/usuarios/registro', { method: 'POST', body: usuario })

/** GET /api/usuarios/{id} -> UsuarioResponseDTO (el propio usuario o un ADMIN) */
export const getUsuario = (id) => apiFetch(`/usuarios/${id}`)

/** GET /api/usuarios -> [UsuarioResponseDTO] (solo ADMIN) */
export const getUsuarios = () => apiFetch('/usuarios')

/**
 * PUT /api/usuarios/{id} (mismo body que el registro) -> UsuarioResponseDTO
 * La contraseña es opcional: si no viene, el back conserva la actual.
 */
export const actualizarUsuario = (id, usuario) =>
  apiFetch(`/usuarios/${id}`, { method: 'PUT', body: usuario })

/** DELETE /api/usuarios/{id} -> 204 (el propio usuario o un ADMIN) */
export const eliminarUsuario = (id) => apiFetch(`/usuarios/${id}`, { method: 'DELETE' })
