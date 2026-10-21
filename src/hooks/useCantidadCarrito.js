import { useEffect, useState } from 'react'
import { EVENTO_CARRITO_ACTUALIZADO, getCarrito } from '@/api/carrito'
import { useAuth } from '@/hooks/useAuth'

/**
 * Cantidad total de unidades en la compra en curso ("Mi compra").
 * El back es la fuente de verdad: se consulta al iniciar sesión y cuando cambia la compra.
 * TODO: optimizar cuando se agregue Redux, para no consultar la API en cada cambio.
 * @returns {number}
 */
export function useCantidadCarrito() {
  const { estaLogueado, usuario } = useAuth()
  const usuarioId = usuario?.id
  const [cantidad, setCantidad] = useState({ usuarioId: null, total: 0 })

  useEffect(() => {
    if (!estaLogueado) return

    let activo = true
    let pedido = 0

    const cargar = async () => {
      const pedidoActual = ++pedido
      try {
        const items = await getCarrito()
        if (!activo || pedidoActual !== pedido) return
        setCantidad({
          usuarioId,
          total: items.reduce((suma, item) => suma + item.cantidad, 0),
        })
      } catch {
        // Si falla, se conserva la última cantidad conocida (0 en la carga inicial).
      }
    }

    cargar()
    window.addEventListener(EVENTO_CARRITO_ACTUALIZADO, cargar)
    return () => {
      activo = false
      window.removeEventListener(EVENTO_CARRITO_ACTUALIZADO, cargar)
    }
  }, [estaLogueado, usuarioId])

  return estaLogueado && cantidad.usuarioId === usuarioId ? cantidad.total : 0
}
