import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getFavoritos } from '@/api/favoritos'
import { useAuth } from '@/hooks/useAuth'
import { clearFavorites, setCargando, setError, setFavorites } from '@/store/slices/favoriteSlice'

/**
 * Mantiene el store de favoritos sincronizado con el usuario de la sesión:
 * carga su lista al iniciar sesión y la limpia al cerrar sesión. Así los
 * favoritos de un usuario no se mezclan con los de otro.
 *
 * La carga usa src/api/favoritos.js, que en modo mock lee localStorage y en
 * modo real llama a GET /api/favoritos.
 */
export function useSincronizarFavoritos() {
  const dispatch = useDispatch()
  const { usuario, estaLogueado } = useAuth()
  const usuarioId = usuario?.id ?? null

  useEffect(() => {
    if (!estaLogueado || usuarioId == null) {
      dispatch(clearFavorites())
      return
    }

    // Si el usuario cambia mientras la respuesta viaja, se descarta.
    let cancelado = false
    // Arranca sin los favoritos del usuario anterior mientras llega la lista nueva.
    dispatch(setFavorites([]))
    dispatch(setCargando(true))
    dispatch(setError(null))

    getFavoritos(usuarioId)
      .then((favoritos) => {
        if (cancelado) return
        dispatch(setFavorites(Array.isArray(favoritos) ? favoritos : []))
      })
      .catch((error) => {
        if (cancelado) return
        dispatch(setFavorites([]))
        dispatch(setError(error.message))
      })
      .finally(() => {
        if (!cancelado) dispatch(setCargando(false))
      })

    return () => {
      cancelado = true
    }
  }, [dispatch, estaLogueado, usuarioId])
}
