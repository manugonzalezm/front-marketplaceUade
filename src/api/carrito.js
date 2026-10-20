import { apiFetch } from './client'

// Módulo del recurso carrito ("Mi compra" en la UI). Todos los endpoints piden
// sesión: apiFetch agrega el token del header Authorization.

/** GET /api/carrito -> [{ id, usuarioId, productoId, nombreProducto, precio, cantidad }] */
export const getCarrito = () => apiFetch('/carrito')

/** POST /api/carrito { productoId, cantidad } -> ítem agregado */
export const agregarAlCarrito = ({ productoId, cantidad }) =>
  apiFetch('/carrito', { method: 'POST', body: { productoId, cantidad } })

/**
 * POST /api/carrito/checkout -> { pedidoId, usuarioId, fecha, total, items: [{ productoId, nombreProducto,
 * cantidad, precioUnitario }] }. Descuenta el stock y vacía la compra en curso.
 * Mientras no le podamos pegar a la API, CheckoutPage usa la versión simulada de checkoutSimulado.js.
 */
export const confirmarCompra = () => apiFetch('/carrito/checkout', { method: 'POST' })
