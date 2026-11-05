import { configureStore } from '@reduxjs/toolkit'
// importamos el REDUCER (el export default de favoriteSlice.js)
import favoriteReducer from './slices/favoriteSlice'

// Los favoritos son del navegador (no del back): se guardan en localStorage
// para que sigan estando al recargar la página.
const CLAVE_FAVORITOS = 'marketplace.favoritos'

/** Lee los favoritos guardados en este navegador; si algo falla, arranca vacío. */
function cargarFavoritos() {
  try {
    const guardados = JSON.parse(localStorage.getItem(CLAVE_FAVORITOS))
    return Array.isArray(guardados) ? guardados : []
  } catch {
    return []
  }
}

// el store: la "bóveda" con todo el estado global de la app
export const store = configureStore({
  reducer: {
    // la clave 'favorite' es el nombre con que los componentes van a leerlo:
    // useSelector((store) => store.favorite.items)
    favorite: favoriteReducer,
    // acá se suman los próximos: cart: cartReducer, user: userReducer
  },
  // arranca con lo que quedó guardado en el navegador
  preloadedState: {
    favorite: { items: cargarFavoritos() },
  },
})

// cada cambio en los favoritos se guarda en el navegador
store.subscribe(() => {
  try {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(store.getState().favorite.items))
  } catch {
    // si el navegador bloquea localStorage, los favoritos siguen en memoria
  }
})
