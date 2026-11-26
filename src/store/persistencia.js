import { TEMAS } from './slices/preferenciasSlice'

// Persistencia de datos NO sensibles del store en localStorage.
//
// Regla: acá solo va lo que no sirve para nada a un atacante (tema, idioma...).
// El token de sesión no se guarda en el front (va en una cookie HttpOnly) y el
// usuario se vuelve a pedir al back con GET /api/usuarios/me.
//
// localStorage y no sessionStorage: la preferencia tiene que sobrevivir a cerrar
// el navegador, no solo al F5.

const CLAVE_PREFERENCIAS = 'marketplace.preferencias'

/** Tema del sistema operativo, para la primera visita. */
function temaDelSistema() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro'
}

/**
 * Lee las preferencias guardadas. Cualquier cosa que no sea un valor conocido se
 * descarta: localStorage lo puede editar el usuario (o un script), así que no se
 * confía en su contenido.
 * @returns {{ tema: 'claro' | 'oscuro' }}
 */
export function leerPreferencias() {
  let guardadas = null
  try {
    guardadas = JSON.parse(localStorage.getItem(CLAVE_PREFERENCIAS))
  } catch {
    // JSON roto o navegador sin almacenamiento: se usan los valores por defecto
  }
  return {
    tema: TEMAS.includes(guardadas?.tema) ? guardadas.tema : temaDelSistema(),
  }
}

/** @param {{ tema: string }} preferencias */
export function guardarPreferencias(preferencias) {
  try {
    localStorage.setItem(CLAVE_PREFERENCIAS, JSON.stringify({ tema: preferencias.tema }))
  } catch {
    // modo privado o almacenamiento lleno: la preferencia dura hasta recargar
  }
}
