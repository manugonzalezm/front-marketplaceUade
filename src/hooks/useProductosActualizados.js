import { useEffect, useState } from 'react'
import { getProducto } from '@/api/productos'

/**
 * Trae los datos actuales de los productos favoritos, indexados por id.
 *
 * El store de favoritos guarda una foto del producto en el momento en que se
 * marcó el corazón: si después cambia el stock (por ejemplo, tras una compra),
 * esa foto queda vieja. Esto se refresca al entrar a la pantalla y cada vez que
 * se vuelve a la pestaña. Si un producto ya no existe o falla la consulta, se
 * conserva el último dato conocido.
 */
export function useProductosActualizados(favoritos) {
  const [actualizados, setActualizados] = useState({})
  // Dependemos solo de los ids: si cambia el stock en el store, no queremos
  // volver a disparar las consultas.
  const ids = favoritos.map((producto) => producto.id).join(',')

  useEffect(() => {
    if (!ids) return

    let cancelado = false
    const listaIds = ids.split(',').map(Number)

    const refrescar = async () => {
      const pares = await Promise.all(
        listaIds.map(async (id) => {
          try {
            return [id, await getProducto(id)]
          } catch {
            return [id, null]
          }
        }),
      )
      if (cancelado) return
      setActualizados((anterior) => {
        const nuevo = { ...anterior }
        for (const [id, producto] of pares) {
          if (producto) nuevo[id] = producto
        }
        return nuevo
      })
    }

    refrescar()

    // Al volver desde otra pestaña (o desde otra app) los datos pueden haber
    // cambiado: se refrescan de nuevo.
    const alVolver = () => {
      if (document.visibilityState === 'visible') refrescar()
    }
    window.addEventListener('focus', alVolver)
    document.addEventListener('visibilitychange', alVolver)

    return () => {
      cancelado = true
      window.removeEventListener('focus', alVolver)
      document.removeEventListener('visibilitychange', alVolver)
    }
  }, [ids])

  return actualizados
}
