import { createSlice } from '@reduxjs/toolkit';

// Slice de favoritos: guarda los productos que el usuario marcó con ❤️
const favoriteSlice = createSlice({
  // nombre del slice: se usa para armar el type de las actions ('favorite/addFavorite')
  name: 'favorite',

  // DATOS: estado inicial, sin favoritos
  initialState: {
    items: [], // array de productos: { id, nombre, precio, ... }
  },

  // FUNCIONES: las únicas formas de modificar los favoritos
  reducers: {
    // se ejecuta con dispatch(addFavorite(producto))
    // action.payload = el producto que mandó el componente
    addFavorite: (state, action) => {
      const producto = action.payload;
      // buscamos si ya está, para no agregarlo dos veces
      const yaExiste = state.items.find((item) => item.id === producto.id);
      if (!yaExiste) {
        state.items.push(producto);
      }
    },

    // se ejecuta con dispatch(removeFavorite(id))
    // action.payload = el id del producto a quitar
    removeFavorite: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // se ejecuta con dispatch(clearFavorites())
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

// exportamos las FUNCIONES (actions) para que los componentes las usen con dispatch
export const { addFavorite, removeFavorite, clearFavorites } = favoriteSlice.actions;

// exportamos el REDUCER para registrarlo en el store
export default favoriteSlice.reducer;