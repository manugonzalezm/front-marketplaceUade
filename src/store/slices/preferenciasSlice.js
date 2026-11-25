import { createSlice } from '@reduxjs/toolkit'

// Slice de preferencias de la interfaz: datos NO sensibles que conviene recordar
// entre visitas. Hoy solo el tema (claro u oscuro).
//
// Se persisten en localStorage (src/store/persistencia.js): si alguien los lee o
// los cambia no gana nada, y al leerlos se validan contra TEMAS, así que un valor
// adulterado no rompe la app. Nunca se guarda acá nada de la sesión ni del usuario.

export const TEMAS = ['claro', 'oscuro']

const preferenciasSlice = createSlice({
  name: 'preferencias',

  // El estado inicial real lo arma store.js con lo guardado (o el tema del sistema).
  initialState: {
    tema: 'claro',
  },

  reducers: {
    // dispatch(alternarTema()): claro <-> oscuro
    alternarTema: (state) => {
      state.tema = state.tema === 'oscuro' ? 'claro' : 'oscuro'
    },
  },
})

export const { alternarTema } = preferenciasSlice.actions

export default preferenciasSlice.reducer
