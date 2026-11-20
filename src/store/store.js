import { configureStore } from '@reduxjs/toolkit'
// importamos los REDUCERS (el export default de cada slice)
import cartReducer from './slices/cartSlice'
import favoriteReducer from './slices/favoriteSlice'

// el store: la "bóveda" con todo el estado global de la app
export const store = configureStore({
  reducer: {
    // la clave es el nombre con que los componentes leen cada parte:
    // useSelector((store) => store.favorite.items)
    favorite: favoriteReducer,
    // useSelector((store) => store.cart.items)
    cart: cartReducer,
    // acá se suman los próximos: user: userReducer
  },
})

// Los favoritos y el carrito no se guardan acá: dependen del usuario con sesión iniciada.
// useSincronizarFavoritos y useSincronizarCarrito los cargan al entrar y los limpian al salir.
// src/api/favoritos.js decide entre localStorage (mock) y el back (real); el carrito siempre
// pasa por src/api/carrito.js (apiFetch usa los datos de prueba en modo mock).
