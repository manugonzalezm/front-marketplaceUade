import { apiFetch } from './client'

// Módulo del recurso productos. Las funciones devuelven los DTO tal cual los manda
// el back; la lógica de pantalla (filtros, orden, estados) queda en la vista.

/** GET /api/productos -> [{ id, nombre, descripcion, precio, stock, categoriaId, usuarioId }] */
export const getProductos = ({ categoriaId, usuarioId } = {}) => {
  const params = new URLSearchParams()
  if (categoriaId) params.set('categoriaId', categoriaId)
  if (usuarioId) params.set('usuarioId', usuarioId)
  const query = params.toString()
  return apiFetch(`/productos${query ? `?${query}` : ''}`)
}

/** GET /api/productos/{id} -> { id, nombre, descripcion, precio, stock, categoriaId, usuarioId } */
export const getProducto = (id) => apiFetch(`/productos/${id}`)

/** GET /api/productos/{id}/imagenes -> [{ id, nombreArchivo, tipoContenido, tamanio, url }] */
export const getProductoImagenes = (id) => apiFetch(`/productos/${id}/imagenes`)
