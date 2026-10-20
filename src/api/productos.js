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


/** DELETE /api/productos/{id} -> 204 (solo el dueño del producto) */
export const eliminarProducto = (id) => apiFetch(`/productos/${id}`, { method: 'DELETE' })

/** DELETE /api/productos/{id}/imagenes/{imagenId} -> 204 (solo el dueño del producto) */
export const eliminarImagen = (productoId, imagenId) =>
  apiFetch(`/productos/${productoId}/imagenes/${imagenId}`, { method: 'DELETE' })

/** POST /api/productos { nombre, descripcion, precio, stock, categoriaId } -> ProductoResponseDTO */
export const crearProducto = (producto) => apiFetch('/productos', { method: 'POST', body: producto })

/** PUT /api/productos/{id} (mismo body que el alta) -> ProductoResponseDTO */
export const actualizarProducto = (id, producto) =>
  apiFetch(`/productos/${id}`, { method: 'PUT', body: producto })

/** POST /api/productos/{id}/imagenes, multipart con el campo "archivo" -> ImagenProductoResponseDTO */
export const subirImagenProducto = (id, archivo) => {
  const datos = new FormData()
  datos.append('archivo', archivo)
  return apiFetch(`/productos/${id}/imagenes`, { method: 'POST', body: datos })
}