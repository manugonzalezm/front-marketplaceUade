import { configureStore } from '@reduxjs/toolkit'
// importamos el REDUCER (el export default de favoriteSlice.js)
import favoriteReducer from './slices/favoriteSlice'

// el store: la "bóveda" con todo el estado global de la app
export const store = configureStore({
  reducer: {
    // la clave 'favorite' es el nombre con que los componentes van a leerlo:
    // useSelector((store) => store.favorite.items)
    favorite: favoriteReducer,
    // acá se suman los próximos: cart: cartReducer, user: userReducer
  },
})

// Los favoritos no se guardan acá: dependen del usuario con sesión iniciada.
// useSincronizarFavoritos los carga al entrar y los limpia al salir, y
// src/api/favoritos.js decide entre localStorage (mock) y el back (real).
