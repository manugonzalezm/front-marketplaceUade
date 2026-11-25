import { configureStore } from '@reduxjs/toolkit'
import { guardarPreferencias, leerPreferencias } from './persistencia'
// importamos los REDUCERS (el export default de cada slice)
import cartReducer from './slices/cartSlice'
import favoriteReducer from './slices/favoriteSlice'
import preferenciasReducer from './slices/preferenciasSlice'

// el store: la "bóveda" con todo el estado global de la app
export const store = configureStore({
  reducer: {
    // useSelector((store) => store.preferencias.tema)
    preferencias: preferenciasReducer,
    // la clave es el nombre con que los componentes leen cada parte:
    // useSelector((store) => store.favorite.items)
    favorite: favoriteReducer,
    // useSelector((store) => store.cart.items)
    cart: cartReducer,
  },
  // Las preferencias arrancan con lo guardado en localStorage (dato no sensible).
  preloadedState: {
    preferencias: leerPreferencias(),
  },
})

// Cada vez que cambian las preferencias, se guardan. Se compara la referencia: Redux
// Toolkit crea un objeto nuevo solo cuando el slice cambia.
let preferenciasGuardadas = store.getState().preferencias
store.subscribe(() => {
  const { preferencias } = store.getState()
  if (preferencias !== preferenciasGuardadas) {
    preferenciasGuardadas = preferencias
    guardarPreferencias(preferencias)
  }
})

// Los favoritos y el carrito no se guardan acá: dependen del usuario con sesión iniciada.
// useSincronizarFavoritos y useSincronizarCarrito los cargan al entrar y los limpian al salir.
// src/api/favoritos.js decide entre localStorage (mock) y el back (real); el carrito siempre
// pasa por src/api/carrito.js (apiFetch usa los datos de prueba en modo mock).
