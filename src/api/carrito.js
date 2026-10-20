import { apiFetch } from './client'

// Módulo del recurso carrito ("Mi compra" en la UI). Todos los endpoints piden
// sesión: apiFetch agrega el token del header Authorization.

/** GET /api/carrito -> [{ id, usuarioId, productoId, nombreProducto, precio, cantidad }] */
export const getCarrito = () => apiFetch('/carrito')

/** POST /api/carrito { productoId, cantidad } -> ítem agregado */
export const agregarAlCarrito = ({ productoId, cantidad }) =>
  apiFetch('/carrito', { method: 'POST', body: { productoId, cantidad } })

/** DELETE /api/carrito/items/{itemId} -> 204 */
export const eliminarItemCarrito = (itemId) => apiFetch(`/carrito/items/${itemId}`, { method: 'DELETE' })
