import { ApiError } from './client.js'

// Adaptador temporal del punto 7: no escribe tokens ni llama al backend.
export const USUARIO_DEMO = Object.freeze({ id: 1, nombre: 'Ana', apellido: 'Pérez' })
const BASE_DEMO = '/demo-mis-productos'

async function leerJson(archivo) {
  const respuesta = await fetch(`${BASE_DEMO}/${archivo}`)
  if (!respuesta.ok)
    throw new ApiError(respuesta.status, 'No pudimos cargar tus publicaciones. Probá de nuevo.')
  try {
    return await respuesta.json()
  } catch {
    throw new ApiError(500, 'Los datos de prueba no se pudieron leer. Probá de nuevo.')
  }
}

/**
 * Simulación aislada. Conserva las bajas en memoria hasta recargar la página.
 * @param {() => Promise<{productos: object[], imagenes: Record<string, object[]>}>} cargarDatos
 */
export function crearServicioMisProductos(cargarDatos) {
  let datosPendientes
  async function obtenerDatos() {
    if (!datosPendientes) {
      datosPendientes = Promise.resolve()
        .then(cargarDatos)
        .then((datos) => {
          if (!Array.isArray(datos.productos) || !datos.imagenes || typeof datos.imagenes !== 'object') {
            throw new ApiError(500, 'Los datos de prueba no tienen el formato esperado.')
          }
          return structuredClone(datos)
        })
        .catch((error) => {
          datosPendientes = undefined
          throw error
        })
    }
    return datosPendientes
  }
  function validarId(id) {
    if (!Number.isSafeInteger(id) || id <= 0) throw new ApiError(400, 'El identificador no es válido.')
  }
  function buscarProducto(datos, productoId, usuarioId) {
    validarId(usuarioId)
    validarId(productoId)
    const producto = datos.productos.find((item) => item.id === productoId)
    if (!producto) throw new ApiError(404, 'El producto ya no está disponible.')
    if (producto.usuarioId !== usuarioId) throw new ApiError(403, 'Solo podés gestionar tus publicaciones.')
    return producto
  }
  return {
    /** Simula GET /api/productos?usuarioId=, incluyendo stock cero. */
    async getMisProductos(usuarioId) {
      validarId(usuarioId)
      const datos = await obtenerDatos()
      return structuredClone(datos.productos.filter((producto) => producto.usuarioId === usuarioId)).sort(
        (a, b) => a.nombre.localeCompare(b.nombre, 'es'),
      )
    },
    /** Simula GET /api/productos/{id}/imagenes. */
    async getImagenesProducto(productoId, usuarioId) {
      const datos = await obtenerDatos()
      buscarProducto(datos, productoId, usuarioId)
      return structuredClone(datos.imagenes[productoId] ?? [])
    },
    /** Simula DELETE /api/productos/{id}; null representa la respuesta 204. */
    async eliminarProducto(productoId, usuarioId) {
      const datos = await obtenerDatos()
      buscarProducto(datos, productoId, usuarioId)
      datos.productos = datos.productos.filter((producto) => producto.id !== productoId)
      delete datos.imagenes[productoId]
      return null
    },
    /** Simula DELETE /api/productos/{id}/imagenes/{imagenId}. */
    async eliminarImagen(productoId, imagenId, usuarioId) {
      const datos = await obtenerDatos()
      buscarProducto(datos, productoId, usuarioId)
      validarId(imagenId)
      const imagenes = datos.imagenes[productoId] ?? []
      if (!imagenes.some((imagen) => imagen.id === imagenId)) throw new ApiError(404, 'La foto ya no existe.')
      datos.imagenes[productoId] = imagenes.filter((imagen) => imagen.id !== imagenId)
      return null
    },
  }
}
const servicio = crearServicioMisProductos(async () => {
  const [productos, imagenes] = await Promise.all([leerJson('productos.json'), leerJson('imagenes.json')])
  return { productos, imagenes }
})
export const { getMisProductos, getImagenesProducto, eliminarProducto, eliminarImagen } = servicio
