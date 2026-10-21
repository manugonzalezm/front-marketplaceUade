import { apiFetch } from './client'

// Módulo del recurso carrito ("Mi compra" en la UI). Todos los endpoints piden
// sesión: apiFetch agrega el token del header Authorization.

/** Evento para refrescar el contador del header después de una compra exitosa. */
export const EVENTO_CARRITO_ACTUALIZADO = 'marketplace:carrito-actualizado'

const avisarCarritoActualizado = () => {
  window.dispatchEvent(new Event(EVENTO_CARRITO_ACTUALIZADO))
}

/** GET /api/carrito -> [{ id, usuarioId, productoId, nombreProducto, precio, cantidad }] */
export const getCarrito = () => apiFetch('/carrito')

/** POST /api/carrito { productoId, cantidad } -> ítem agregado */
export const agregarAlCarrito = async ({ productoId, cantidad }) => {
  const item = await apiFetch('/carrito', { method: 'POST', body: { productoId, cantidad } })
  avisarCarritoActualizado()
  return item
}

/** POST /api/carrito/checkout -> pedido con sus ítems; descuenta stock y vacía la compra. */
export const confirmarCompra = async () => {
  const pedido = await apiFetch('/carrito/checkout', { method: 'POST' })
  avisarCarritoActualizado()
  return pedido
}

/** DELETE /api/carrito/items/{itemId} -> 204 */
export const eliminarItemCarrito = async (itemId) => {
  const resultado = await apiFetch(`/carrito/items/${itemId}`, { method: 'DELETE' })
  avisarCarritoActualizado()
  return resultado
}

/** DELETE /api/carrito -> 204 */
export const vaciarCarrito = async () => {
  const resultado = await apiFetch('/carrito', { method: 'DELETE' })
  avisarCarritoActualizado()
  return resultado
}
