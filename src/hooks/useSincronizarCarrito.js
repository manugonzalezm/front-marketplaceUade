import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { EVENTO_CARRITO_ACTUALIZADO } from '@/api/carrito'
import { useAuth } from '@/hooks/useAuth'
import { clearCart, fetchCarrito } from '@/store/slices/cartSlice'

/**
 * Mantiene el store del carrito sincronizado con el usuario de la sesión:
 * carga su carrito (GET /api/carrito) al iniciar sesión y lo limpia al cerrar sesión.
 *
 * También lo vuelve a cargar cuando otra pantalla cambia la compra (quitar un ítem,
 * vaciarla o confirmarla): src/api/carrito.js avisa con EVENTO_CARRITO_ACTUALIZADO.
 */
export function useSincronizarCarrito() {
  const dispatch = useDispatch()
  const { usuario, estaLogueado } = useAuth()
  const usuarioId = usuario?.id ?? null

  useEffect(() => {
    if (!estaLogueado || usuarioId == null) {
      dispatch(clearCart())
      return
    }

    // Arranca sin los ítems del usuario anterior mientras llega el carrito nuevo.
    dispatch(clearCart())
    dispatch(fetchCarrito())

    const recargar = () => dispatch(fetchCarrito())
    window.addEventListener(EVENTO_CARRITO_ACTUALIZADO, recargar)
    return () => {
      window.removeEventListener(EVENTO_CARRITO_ACTUALIZADO, recargar)
    }
  }, [dispatch, estaLogueado, usuarioId])
}
