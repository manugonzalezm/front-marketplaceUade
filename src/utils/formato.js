const formatoPrecio = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
})

const formatoFecha = new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium' })

/** 15000 -> "$ 15.000" */
export function formatearPrecio(valor) {
  return formatoPrecio.format(valor ?? 0)
}

/** '2026-10-18' o '2026-10-18T22:10:00' -> "18 oct 2026" */
export function formatearFecha(valor) {
  return valor ? formatoFecha.format(new Date(valor)) : ''
}

/** Número de pedido siempre con 8 dígitos: 48213765 -> "48213765", 12 -> "00000012" */
export function formatearNumeroPedido(pedidoId) {
  return String(pedidoId ?? '').padStart(8, '0')
}
