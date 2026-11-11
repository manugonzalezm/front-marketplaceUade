import { apiFetch, USAR_MOCKS } from './client'

// Favoritos por usuario.
// - Modo mock (USAR_MOCKS): se guardan en localStorage con una clave por usuario.
// - Modo real: se persisten en el back (GET/POST/DELETE /api/favoritos).
//
// Cada favorito se guarda con la forma de ProductoResponseDTO más `imagenUrl`,
// que la tarjeta usa para mostrar la foto en la pantalla de favoritos.

const PREFIJO_CLAVE = 'marketplace.favoritos.'

/** Clave de localStorage de los favoritos de un usuario. */
function claveDe(usuarioId) {
  return `${PREFIJO_CLAVE}${usuarioId}`
}

function leerDeLocalStorage(usuarioId) {
  try {
    const guardados = JSON.parse(localStorage.getItem(claveDe(usuarioId)))
    return Array.isArray(guardados) ? guardados : []
  } catch {
    return []
  }
}

function escribirEnLocalStorage(usuarioId, favoritos) {
  try {
    localStorage.setItem(claveDe(usuarioId), JSON.stringify(favoritos))
  } catch {
    // si el navegador bloquea localStorage, los favoritos quedan solo en memoria
  }
}

/** GET /api/favoritos (mock: localStorage del usuario) -> ProductoResponseDTO[] */
export async function getFavoritos(usuarioId) {
  if (!USAR_MOCKS) return apiFetch('/favoritos')
  return leerDeLocalStorage(usuarioId)
}

/** POST /api/favoritos/{productoId} (mock: agrega al localStorage del usuario) */
export async function agregarFavorito(usuarioId, producto) {
  if (!USAR_MOCKS) return apiFetch(`/favoritos/${producto.id}`, { method: 'POST' })

  const favoritos = leerDeLocalStorage(usuarioId)
  if (!favoritos.some((item) => item.id === producto.id)) {
    favoritos.push(producto)
    escribirEnLocalStorage(usuarioId, favoritos)
  }
  return producto
}

/** DELETE /api/favoritos/{productoId} (mock: lo saca del localStorage del usuario) */
export async function quitarFavorito(usuarioId, productoId) {
  if (!USAR_MOCKS) return apiFetch(`/favoritos/${productoId}`, { method: 'DELETE' })

  const favoritos = leerDeLocalStorage(usuarioId)
  escribirEnLocalStorage(
    usuarioId,
    favoritos.filter((item) => item.id !== productoId),
  )
}
