import { ApiError } from './client'

// Simulación temporal del checkout, mientras no le podemos pegar a la API.
// Responde con los JSON de public/data/checkout/, que tienen el formato exacto de los DTO del back:
//   carrito.json    -> GET  /api/carrito           (CarritoItemResponseDTO[])
//   respuesta.json  -> POST /api/carrito/checkout  (CheckoutResponseDTO: el pedido con sus ítems)
//
// Exporta las mismas funciones que carrito.js. Para pasar a la API real alcanza con cambiar el import
// en CheckoutPage: '@/api/checkoutSimulado' -> '@/api/carrito'.

const BASE_DATOS = '/data/checkout'
const DEMORA_MS = 600 // simula la demora de la red para ver los estados "Cargando…" y "Confirmando…"

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))

async function leerJson(archivo) {
  await esperar(DEMORA_MS)
  const respuesta = await fetch(`${BASE_DATOS}/${archivo}`).catch(() => null)
  const esJson = respuesta?.headers.get('content-type')?.includes('application/json')
  // Si el archivo no existe, Vite devuelve el index.html: lo tratamos como error.
  if (!respuesta?.ok || !esJson) {
    throw new ApiError(500, 'No pudimos cargar los datos de prueba del checkout. Probá de nuevo.')
  }
  return respuesta.json()
}

/** Número de pedido de 8 dígitos (10000000 a 99999999), como el que se le muestra al comprador. */
export const generarNumeroPedido = () => Math.floor(10_000_000 + Math.random() * 90_000_000)

/** Fecha y hora actual con el formato de LocalDateTime del back: '2026-10-20T19:30:00'. */
const ahora = () => {
  const fecha = new Date()
  fecha.setMinutes(fecha.getMinutes() - fecha.getTimezoneOffset()) // hora local, no UTC
  return fecha.toISOString().slice(0, 19)
}

/** Simula GET /api/carrito -> [{ id, usuarioId, productoId, nombreProducto, precio, cantidad }] */
export const getCarrito = () => leerJson('carrito.json')

/**
 * Simula POST /api/carrito/checkout -> { pedidoId, usuarioId, fecha, total, items }.
 * Cada confirmación genera un pedidoId nuevo de 8 dígitos y la fecha del momento; los ítems y el total salen
 * de respuesta.json.
 */
export const confirmarCompra = async () => {
  const pedido = await leerJson('respuesta.json')
  return { ...pedido, pedidoId: generarNumeroPedido(), fecha: ahora() }
}
