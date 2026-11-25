import { useLayoutEffect } from 'react'
import { useSelector } from 'react-redux'

/**
 * Aplica el tema guardado en store.preferencias poniendo data-tema en <html>
 * (tokens.css cambia los colores según ese atributo). useLayoutEffect y no
 * useEffect: corre antes de que el navegador pinte, así no hay un destello del
 * tema claro al recargar con el oscuro elegido.
 */
export function useAplicarTema() {
  const tema = useSelector((store) => store.preferencias.tema)

  useLayoutEffect(() => {
    document.documentElement.dataset.tema = tema
  }, [tema])
}
