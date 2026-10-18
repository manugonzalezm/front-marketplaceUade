// Cliente HTTP único para hablar con el back. Los módulos de src/api/
// (productos.js, carrito.js, etc.) lo usan; los componentes nunca llaman a fetch.
//
// En desarrollo Vite redirige /api a http://localhost:8080 (ver vite.config.js),
// así que las rutas van sin host: apiFetch('/productos').

export const TOKEN_STORAGE_KEY = 'marketplace.token'

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

  const datos = await respuesta.json().catch(() => null)

  if (!respuesta.ok) {
    throw new ApiError(
      respuesta.status,
      datos?.mensaje ?? 'No se pudo completar la operación. Probá de nuevo.',
    )
  }

  return datos
}
