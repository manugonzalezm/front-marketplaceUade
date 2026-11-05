import { createSlice } from '@reduxjs/toolkit'

// Slice de favoritos: guarda los productos que el usuario marcó con ❤️.
// El store solo tiene la lista del usuario con sesión iniciada: se carga al
// entrar y se limpia al salir (useSincronizarFavoritos).
const favoriteSlice = createSlice({
  // nombre del slice: se usa para armar el type de las actions ('favorite/addFavorite')
  name: 'favorite',

  // DATOS: estado inicial, sin favoritos
  initialState: {
    items: [], // array de productos: { id, nombre, precio, ... }
    cargando: false,
    error: null,
  },

  // FUNCIONES: las únicas formas de modificar los favoritos
  reducers: {
    // se ejecuta con dispatch(addFavorite(producto))
    // action.payload = el producto que mandó el componente
    addFavorite: (state, action) => {
      const producto = action.payload
      // buscamos si ya está, para no agregarlo dos veces
      const yaExiste = state.items.find((item) => item.id === producto.id)
      if (!yaExiste) {
        state.items.push(producto)
      }
    },

    // se ejecuta con dispatch(removeFavorite(id))
    // action.payload = el id del producto a quitar
    removeFavorite: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },

    // reemplaza la lista entera con lo que devolvió el back (o el localStorage)
    setFavorites: (state, action) => {
      state.items = action.payload
    },

    setCargando: (state, action) => {
      state.cargando = action.payload
    },

    setError: (state, action) => {
      state.error = action.payload
    },

    // se ejecuta al cerrar sesión: no quedan favoritos de otro usuario
    clearFavorites: (state) => {
      state.items = []
      state.cargando = false
      state.error = null
    },
  },
})

// exportamos las FUNCIONES (actions) para que los componentes las usen con dispatch
export const { addFavorite, removeFavorite, setFavorites, setCargando, setError, clearFavorites } =
  favoriteSlice.actions

// exportamos el REDUCER para registrarlo en el store
export default favoriteSlice.reducer
