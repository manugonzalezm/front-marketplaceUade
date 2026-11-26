// Cliente HTTP único para hablar con el back. Los módulos de src/api/
// (productos.js, carrito.js, etc.) lo usan; los componentes nunca llaman a fetch.
//
// En desarrollo Vite redirige /api a http://localhost:8080 (ver vite.config.js),
// así que las rutas van sin host: apiFetch('/productos').

// Sesión: el JWT viaja en una cookie HttpOnly que pone el back en el login
// (marketplace_token). El navegador la manda sola en cada request a /api y
// JavaScript no puede leerla, así que acá no se guarda ni se maneja ningún token.
// Ver docs/persistencia-sesion.md.

import { respuestaMock } from './mock'

// Cookie y header del token CSRF (los nombres por defecto de Spring Security).
const COOKIE_CSRF = 'XSRF-TOKEN'
const HEADER_CSRF = 'X-XSRF-TOKEN'
const METODOS_SEGUROS = ['GET', 'HEAD', 'OPTIONS']

// Rutas cuyo 401 no significa "se venció la sesión" (credenciales mal, o el
// chequeo de sesión al abrir la app, que ya maneja authSlice).
const RUTAS_SIN_AVISO_401 = ['/usuarios/login', '/usuarios/me']

let alExpirarSesion = () => {}

/**
 * Registra qué hacer cuando el back responde 401 a una request de alguien que
 * creía tener sesión (la cookie venció o la borraron). Lo configura store.js para
 * limpiar authSlice; client.js no importa el store para no armar un ciclo.
 * @param {() => void} callback
 */
export function configurarSesionExpirada(callback) {
  alExpirarSesion = callback
}

/**
 * Lee una cookie que NO es HttpOnly. La de sesión es HttpOnly, así que acá
 * nunca aparece; la de CSRF sí, porque está hecha para que el front la lea.
 * @param {string} nombre
 */
function leerCookie(nombre) {
  const par = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${nombre}=`))
  return par ? decodeURIComponent(par.slice(nombre.length + 1)) : null
}

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
  try {
    return await pedir(ruta, { method, body })
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && !RUTAS_SIN_AVISO_401.includes(ruta)) {
      alExpirarSesion()
    }
    throw error
  }
}

async function pedir(ruta, { method, body }) {
  if (USAR_MOCKS) return respuestaMock(ruta, { method, body })
  const esFormData = body instanceof FormData
  const headers = {}

  if (body && !esFormData) headers['Content-Type'] = 'application/json'

  // Double submit cookie: el back exige que el valor de la cookie XSRF-TOKEN vuelva
  // en este header en todo POST/PUT/DELETE. Otro sitio no puede leer la cookie,
  // así que no puede falsificar la request (CSRF).
  const tokenCsrf = METODOS_SEGUROS.includes(method) ? null : leerCookie(COOKIE_CSRF)
  if (tokenCsrf) headers[HEADER_CSRF] = tokenCsrf

  const respuesta = await fetch(`/api${ruta}`, {
    method,
    headers,
    body: body && !esFormData ? JSON.stringify(body) : body,
    // Manda las cookies (la de sesión y la de CSRF). Es el valor por defecto de
    // fetch, pero lo dejamos explícito: sin esto no hay sesión.
    credentials: 'same-origin',
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
