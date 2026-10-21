import { apiFetch } from './client'

// Ejemplo de módulo de API: una función por endpoint, sin lógica de pantalla.
// Quien haga la administración de categorías suma acá crear/actualizar/eliminar.

/** GET /api/categorias -> [{ id, nombre }] */
export const getCategorias = () => apiFetch('/categorias')

/** GET /api/categorias/{id} -> { id, nombre } */
export const getCategoria = (id) => apiFetch(`/categorias/${id}`)

/** POST /api/categorias { nombre } -> { id, nombre } (solo ADMIN; 409 si el nombre ya existe) */
export const crearCategoria = (nombre) => apiFetch('/categorias', { method: 'POST', body: { nombre } })

/** PUT /api/categorias/{id} { nombre } -> { id, nombre } (solo ADMIN) */
export const actualizarCategoria = (id, nombre) =>
  apiFetch(`/categorias/${id}`, { method: 'PUT', body: { nombre } })

/** DELETE /api/categorias/{id} -> 204 (solo ADMIN; 409 si tiene productos) */
export const eliminarCategoria = (id) => apiFetch(`/categorias/${id}`, { method: 'DELETE' })
