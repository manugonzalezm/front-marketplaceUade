// Cliente HTTP único para hablar con el back. Los módulos de src/api/
// (productos.js, carrito.js, etc.) lo usan; los componentes nunca llaman a fetch.
//
// En desarrollo Vite redirige /api a http://localhost:8080 (ver vite.config.js),
// así que las rutas van sin host: apiFetch('/productos').

import { respuestaMock } from './mock'

export const TOKEN_STORAGE_KEY = 'marketplace.token'

// Por defecto responde con los datos de prueba de public/data/ (modo mock).
// Para usar el back real: crear .env.local con VITE_USAR_MOCKS=false y levantar el back.
export const USAR_MOCKS = import.meta.env.VITE_USAR_MOCKS !== 'false'

/** Error con el formato que devuelve el back: { status, mensaje, timestamp }. */
export class ApiError extends Error {
  constructor(status, mensaje) {
    super(mensaje)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * @param {string} ruta  Ruta relativa a /api, por ejemplo '/productos?categoriaId=2'
 * @param {{ method?: string, body?: object | FormData }} [opciones]
 * @returns {Promise<any>} El JSON de la respuesta, o null si es 204.
 * @throws {ApiError} Si la respuesta no es 2xx. error.message ya viene listo para mostrar.
 */
export async function apiFetch(ruta, { method = 'GET', body } = {}) {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (USAR_MOCKS) return respuestaMock(ruta, { method, body, token })
  const esFormData = body instanceof FormData
  const headers = {}

  if (body && !esFormData) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const respuesta = await fetch(`/api${ruta}`, {
    method,
    headers,
    body: body && !esFormData ? JSON.stringify(body) : body,
  })

  if (respuesta.status === 204) return null

  const esJson = respuesta.headers.get('content-type')?.includes('application/json')
  const datos = esJson ? await respuesta.json().catch(() => null) : null

  if (!respuesta.ok) {
    throw new ApiError(
      respuesta.status,
      datos?.mensaje ?? 'No se pudo completar la operación. Probá de nuevo.',
    )
  }

  // Un 200 que no es JSON suele ser el index.html: /api no llegó al back
  // (back apagado en desarrollo, o falta el rewrite de /api en vercel.json).
  if (!esJson) {
    throw new ApiError(
      respuesta.status,
      'No pudimos conectarnos con el servidor. Probá de nuevo en unos minutos.',
    )
  }

  return datos
}
