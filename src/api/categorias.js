import { apiFetch } from './client'

// Ejemplo de módulo de API: una función por endpoint, sin lógica de pantalla.
// Quien haga la administración de categorías suma acá crear/actualizar/eliminar.

/** Evento para refrescar la barra de categorías del navbar después de un cambio exitoso. */
export const EVENTO_CATEGORIAS_ACTUALIZADAS = 'marketplace:categorias-actualizadas'

const avisarCategoriasActualizadas = () => {
  window.dispatchEvent(new Event(EVENTO_CATEGORIAS_ACTUALIZADAS))
}

/** GET /api/categorias -> [{ id, nombre }] */
export const getCategorias = () => apiFetch('/categorias')

/** GET /api/categorias/{id} -> { id, nombre } */
export const getCategoria = (id) => apiFetch(`/categorias/${id}`)

/** POST /api/categorias { nombre } -> { id, nombre } (solo ADMIN; 409 si el nombre ya existe) */
export const crearCategoria = async (nombre) => {
  const categoria = await apiFetch('/categorias', { method: 'POST', body: { nombre } })
  avisarCategoriasActualizadas()
  return categoria
}

/** PUT /api/categorias/{id} { nombre } -> { id, nombre } (solo ADMIN) */
export const actualizarCategoria = async (id, nombre) => {
  const categoria = await apiFetch(`/categorias/${id}`, { method: 'PUT', body: { nombre } })
  avisarCategoriasActualizadas()
  return categoria
}

/** DELETE /api/categorias/{id} -> 204 (solo ADMIN; 409 si tiene productos) */
export const eliminarCategoria = async (id) => {
  const resultado = await apiFetch(`/categorias/${id}`, { method: 'DELETE' })
  avisarCategoriasActualizadas()
  return resultado
}
