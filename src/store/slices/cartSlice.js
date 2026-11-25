import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// reusamos las funciones que ya llaman al back (y que en modo mock usan los datos de prueba)
import { agregarAlCarrito, getCarrito } from '@/api/carrito'

// Slice del carrito ("Mi compra"): guarda los ítems del usuario con sesión iniciada.
// El back es la fuente de verdad: el store se carga desde GET /api/carrito al iniciar
// sesión y se limpia al salir (useSincronizarCarrito).

// THUNK: trae el carrito guardado en la base (GET /api/carrito).
// Se ejecuta con dispatch(fetchCarrito()).
export const fetchCarrito = createAsyncThunk('cart/fetchCarrito', async (_, { rejectWithValue }) => {
  try {
    // lo que devolvemos llega como action.payload en el fulfilled
    return await getCarrito()
  } catch (error) {
    // mandamos el mensaje y el código (ej. 401 = sin sesión) al rejected
    return rejectWithValue({ mensaje: error.message, status: error.status })
  }
})

// THUNK: agrega un producto al carrito en la base (POST /api/carrito).
// Se ejecuta con dispatch(addToCart({ productoId, cantidad })).
// El back devuelve el ítem ya guardado (si el producto estaba, con la cantidad sumada).
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productoId, cantidad }, { rejectWithValue }) => {
    try {
      return await agregarAlCarrito({ productoId, cantidad })
    } catch (error) {
      return rejectWithValue({ mensaje: error.message, status: error.status })
    }
  },
)

const cartSlice = createSlice({
  // nombre del slice: se usa para armar el type de las actions ('cart/addToCart')
  name: 'cart',

  // DATOS: estado inicial, sin ítems, sin carga y sin error
  initialState: {
    items: [], // CarritoItemResponseDTO: { id, usuarioId, productoId, nombreProducto, precio, cantidad }
    cargando: false,
    error: null,
  },

  // FUNCIONES sincrónicas
  reducers: {
    // se ejecuta al cerrar sesión: no quedan ítems de otro usuario
    clearCart: (state) => {
      state.items = []
      state.cargando = false
      state.error = null
    },
  },

  // ESTADOS de los thunks: createAsyncThunk despacha pending, fulfilled y rejected automáticamente
  extraReducers: (builder) => {
    builder
      // fetchCarrito
      .addCase(fetchCarrito.pending, (state) => {
        state.cargando = true
        state.error = null
      })
      .addCase(fetchCarrito.fulfilled, (state, action) => {
        state.cargando = false
        state.items = Array.isArray(action.payload) ? action.payload : []
      })
      .addCase(fetchCarrito.rejected, (state, action) => {
        state.cargando = false
        state.error = action.payload?.mensaje ?? 'No pudimos cargar tu compra'
      })
      // addToCart
      .addCase(addToCart.pending, (state) => {
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload
        // si el producto ya estaba en el carrito, se reemplaza por el ítem actualizado
        const indice = state.items.findIndex((elemento) => elemento.productoId === item.productoId)
        if (indice >= 0) {
          state.items[indice] = item
        } else {
          state.items.push(item)
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload?.mensaje ?? 'No pudimos agregar el producto'
      })
  },
})

// exportamos la FUNCIÓN sincrónica para usarla con dispatch
export const { clearCart } = cartSlice.actions

// exportamos el REDUCER (default) para registrarlo en el store
export default cartSlice.reducer
