import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getSesion, login as loginApi, logout as logoutApi } from '@/api/usuarios'

// Slice de la sesión. Guarda SOLO el usuario logueado (UsuarioResponseDTO), en memoria.
//
// ¿Dónde está el token? En ningún lado del front: el back lo pone en una cookie
// HttpOnly (marketplace_token) que el navegador guarda y manda solo en cada request,
// y que JavaScript no puede leer. Por eso un ataque XSS no puede robarlo.
//
// ¿Qué pasa con F5? Redux arranca vacío, pero la cookie sigue en el navegador. Al
// abrir la app se despacha verificarSesion(), que pide GET /api/usuarios/me: si la
// cookie es válida, el back devuelve el usuario y la sesión se recupera. Mientras
// tanto `estado` vale 'verificando' y RutaPrivada muestra un spinner en lugar de
// mandar al login.
//
// Ver docs/persistencia-sesion.md.

// THUNK: recupera la sesión a partir de la cookie (al abrir la app o con F5).
export const verificarSesion = createAsyncThunk('auth/verificarSesion', () => getSesion())

// THUNK: login. El back responde { usuario } y pone la cookie con el token.
// Se usa con dispatch(iniciarSesion({ mail, contrasena })).unwrap() para recibir el error.
export const iniciarSesion = createAsyncThunk('auth/iniciarSesion', async ({ mail, contrasena }) => {
  const { usuario } = await loginApi({ mail, contrasena })
  return usuario
})

// THUNK: logout. El back borra la cookie. Si falla (sin red, back apagado), igual
// se cierra la sesión en el front: lo limpia el pending.
export const cerrarSesion = createAsyncThunk('auth/cerrarSesion', async () => {
  try {
    await logoutApi()
  } catch {
    // la cookie vence sola a las 24 h
  }
})

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    usuario: null, // UsuarioResponseDTO: { id, nombreUsuario, mail, nombre, apellido, fechaNacimiento, sexo, rol }
    estado: 'verificando', // 'verificando' hasta que responde GET /api/usuarios/me; después 'listo'
  },

  reducers: {
    // después de editar el perfil: cambia el usuario, la cookie sigue igual
    usuarioActualizado: (state, action) => {
      state.usuario = action.payload
    },
    // el back respondió 401 a una request: la cookie venció o la borraron
    sesionExpirada: (state) => {
      state.usuario = null
      state.estado = 'listo'
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(verificarSesion.fulfilled, (state, action) => {
        state.usuario = action.payload
        state.estado = 'listo'
      })
      .addCase(verificarSesion.rejected, (state) => {
        // Sin cookie, vencida o back caído: arranca sin sesión. Si mientras tanto el
        // usuario ya ingresó (estado 'listo'), no se pisa su sesión.
        if (state.estado === 'verificando') state.usuario = null
        state.estado = 'listo'
      })
      .addCase(iniciarSesion.fulfilled, (state, action) => {
        state.usuario = action.payload
        state.estado = 'listo'
      })
      // se limpia apenas se pide, sin esperar al back
      .addCase(cerrarSesion.pending, (state) => {
        state.usuario = null
        state.estado = 'listo'
      })
  },
})

export const { usuarioActualizado, sesionExpirada } = authSlice.actions

export default authSlice.reducer
