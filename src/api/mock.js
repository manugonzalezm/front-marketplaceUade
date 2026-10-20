import { ApiError } from './client'

// Modo mock: responde las mismas rutas que el back, pero leyendo los JSON de
// public/data/ en lugar de llamar a Spring Boot. Los datos tienen el formato
// exacto de los DTO del back, así las pantallas no notan la diferencia.
//
// apiFetch (client.js) lo usa cuando VITE_USAR_MOCKS no es 'false'.
// Lo que se crea, edita o borra queda en memoria hasta recargar la página.

const BASE_DATOS = '/data'
const DEMORA_MS = 250 // simula la demora de la red para ver los estados de carga
const CONTRASENA_DEMO = '12345678' // contraseña de todos los usuarios de usuarios.json
const MAX_IMAGENES = 5
const MAX_BYTES_IMAGEN = 5 * 1024 * 1024
const TIPOS_IMAGEN = ['image/jpeg', 'image/png', 'image/webp']

let datosPendientes

// ─── Carga de los JSON ──────────────────────────────────────────────────────

async function leerJson(archivo) {
  const respuesta = await fetch(`${BASE_DATOS}/${archivo}`)
  const esJson = respuesta.headers.get('content-type')?.includes('application/json')
  // Si el archivo no existe, Vite devuelve index.html: lo tratamos como "no hay".
  if (!respuesta.ok || !esJson) return null
  return respuesta.json()
}

/** Lee los JSON de prueba una sola vez y los guarda en memoria. */
function obtenerDatos() {
  if (!datosPendientes) {
    datosPendientes = Promise.all([
      leerJson('productos.json'),
      leerJson('categorias.json'),
      leerJson('usuarios.json'),
      leerJson('carrito.json'),
    ])
      .then(([productos, categorias, usuarios, carrito]) => {
        if (!productos || !categorias || !usuarios) {
          throw new ApiError(500, 'No se pudieron cargar los datos de prueba.')
        }
        return {
          productos,
          categorias,
          usuarios,
          imagenes: {},
          contrasenas: {},
          carrito: carrito ?? [],
          pedidos: [],
        }
      })
      .catch((error) => {
        datosPendientes = undefined // permite reintentar
        throw error
      })
  }
  return datosPendientes
}

/** Las imágenes están en un JSON por producto (imagenes/1.json), como GET /productos/{id}/imagenes. */
async function imagenesDe(datos, productoId) {
  if (!(productoId in datos.imagenes)) {
    datos.imagenes[productoId] = (await leerJson(`imagenes/${productoId}.json`)) ?? []
  }
  return datos.imagenes[productoId]
}

// ─── Utilidades ─────────────────────────────────────────────────────────────

const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms))
const copia = (valor) => structuredClone(valor)
const siguienteId = (lista) => Math.max(0, ...lista.map((item) => item.id)) + 1
const ahora = () => new Date().toISOString().slice(0, 19) // formato de LocalDateTime

function buscar(lista, id, error) {
  const item = lista.find((elemento) => elemento.id === id)
  if (!item) throw error
  return item
}

/** Token con forma de JWT (JSON Web Token): AuthContext lee `exp` del payload. Sin firma real. */
function crearToken(usuario) {
  const base64url = (objeto) =>
    btoa(JSON.stringify(objeto)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')
  const payload = {
    sub: usuario.mail,
    id: usuario.id,
    rol: usuario.rol,
    exp: Math.floor(Date.now() / 1000) + 86400,
  }
  return `${base64url({ alg: 'none', typ: 'JWT' })}.${base64url(payload)}.mock`
}

/** Devuelve el usuario dueño del token, o lanza 401 como el back si no hay sesión. */
function usuarioDeSesion(datos, token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    const usuario = datos.usuarios.find((item) => item.id === payload.id)
    if (usuario) return usuario
  } catch {
    // token ausente o con otro formato: cae en el 401 de abajo
  }
  throw new ApiError(401, 'Usuario no autenticado')
}

function exigirAdmin(usuario) {
  if (usuario.rol !== 'ADMIN') throw new ApiError(403, 'No tenés permiso para realizar esta acción')
}

function validarProducto(datos, body) {
  if (!body?.nombre?.trim()) throw new ApiError(400, 'El nombre es obligatorio')
  if (!(body.precio > 0)) throw new ApiError(400, 'El precio debe ser mayor a 0')
  if (!(Number.isInteger(body.stock) && body.stock >= 0)) {
    throw new ApiError(400, 'El stock debe ser un número entero mayor o igual a 0')
  }
  if (!body.categoriaId) throw new ApiError(400, 'La categoría es obligatoria')
  buscar(
    datos.categorias,
    body.categoriaId,
    new ApiError(404, `Categoría con ID ${body.categoriaId} no encontrada`),
  )
}

// ─── Recursos ───────────────────────────────────────────────────────────────

async function usuarios(datos, { metodo, partes, body, token }) {
  const [, segundo] = partes

  if (metodo === 'POST' && segundo === 'login') {
    const mail = body?.mail?.trim().toLowerCase()
    const usuario = datos.usuarios.find((item) => item.mail.toLowerCase() === mail)
    const contrasena = usuario && (datos.contrasenas[usuario.id] ?? CONTRASENA_DEMO)
    if (!usuario || body?.contrasena !== contrasena) {
      throw new ApiError(401, 'Mail o contraseña incorrectos')
    }
    return { usuario: copia(usuario), token: crearToken(usuario) } // LoginResponseDTO
  }

  if (metodo === 'POST' && segundo === 'registro') {
    const { contrasena, ...resto } = body ?? {}
    if (datos.usuarios.some((item) => item.mail.toLowerCase() === resto.mail?.toLowerCase())) {
      throw new ApiError(409, `Ya existe un usuario con el mail: ${resto.mail}`)
    }
    if (datos.usuarios.some((item) => item.nombreUsuario === resto.nombreUsuario)) {
      throw new ApiError(409, `Ya existe un usuario con el nombre de usuario: ${resto.nombreUsuario}`)
    }
    const nuevo = { id: siguienteId(datos.usuarios), ...resto, rol: 'USUARIO' }
    datos.usuarios.push(nuevo)
    datos.contrasenas[nuevo.id] = contrasena
    return copia(nuevo) // UsuarioResponseDTO: nunca incluye la contraseña
  }

  const sesion = usuarioDeSesion(datos, token)

  if (metodo === 'GET' && !segundo) {
    exigirAdmin(sesion)
    return copia(datos.usuarios)
  }

  const id = Number(segundo)
  const usuario = buscar(datos.usuarios, id, new ApiError(404, `Usuario con ID ${id} no encontrado`))
  if (sesion.id !== id && sesion.rol !== 'ADMIN') {
    throw new ApiError(403, 'Solo podes gestionar tu propia cuenta')
  }

  if (metodo === 'GET') return copia(usuario)
  if (metodo === 'PUT') {
    const { contrasena, ...resto } = body ?? {}
    Object.assign(usuario, resto, { id, rol: usuario.rol })
    if (contrasena) datos.contrasenas[id] = contrasena
    return copia(usuario)
  }
  if (metodo === 'DELETE') {
    datos.usuarios = datos.usuarios.filter((item) => item.id !== id)
    return null
  }
}

async function categorias(datos, { metodo, partes, body, token }) {
  const id = partes[1] ? Number(partes[1]) : null
  const noEncontrada = new ApiError(404, `Categoría con ID ${id} no encontrada`)

  if (metodo === 'GET') return copia(id ? buscar(datos.categorias, id, noEncontrada) : datos.categorias)

  exigirAdmin(usuarioDeSesion(datos, token))
  const nombre = body?.nombre?.trim()
  if (metodo !== 'DELETE' && !nombre) throw new ApiError(400, 'El nombre es obligatorio')
  const repetida = datos.categorias.find((item) => item.nombre.toLowerCase() === nombre?.toLowerCase())
  if (repetida && repetida.id !== id)
    throw new ApiError(409, `Ya existe una categoría con el nombre: ${nombre}`)

  if (metodo === 'POST') {
    const nueva = { id: siguienteId(datos.categorias), nombre }
    datos.categorias.push(nueva)
    return copia(nueva)
  }
  const categoria = buscar(datos.categorias, id, noEncontrada)
  if (metodo === 'PUT') {
    categoria.nombre = nombre
    return copia(categoria)
  }
  if (metodo === 'DELETE') {
    datos.categorias = datos.categorias.filter((item) => item.id !== id)
    return null
  }
}

async function imagenes(datos, { metodo, partes, body, token }, producto) {
  const lista = await imagenesDe(datos, producto.id)
  if (metodo === 'GET' && !partes[3]) return copia(lista)

  const imagenId = Number(partes[3])
  const noEncontrada = new ApiError(404, `Imagen con ID ${imagenId} no encontrada para el producto`)
  if (metodo === 'GET') return copia(buscar(lista, imagenId, noEncontrada))

  const sesion = usuarioDeSesion(datos, token)
  if (producto.usuarioId !== sesion.id) {
    throw new ApiError(403, `El producto con ID ${producto.id} no pertenece al usuario`)
  }

  if (metodo === 'POST') {
    const archivo = body instanceof FormData ? body.get('archivo') : null
    if (!(archivo instanceof File)) throw new ApiError(400, 'No se pudo leer el archivo de imagen')
    if (!TIPOS_IMAGEN.includes(archivo.type)) throw new ApiError(400, 'El formato debe ser JPEG, PNG o WebP')
    if (archivo.size > MAX_BYTES_IMAGEN) throw new ApiError(400, 'La imagen no puede superar los 5 MB')
    if (lista.length >= MAX_IMAGENES) {
      throw new ApiError(400, `El producto no puede tener más de ${MAX_IMAGENES} imágenes`)
    }
    const todas = Object.values(datos.imagenes).flat()
    const nueva = {
      id: Math.max(100, ...todas.map((item) => item.id)) + 1,
      nombreArchivo: archivo.name,
      tipoContenido: archivo.type,
      tamanio: archivo.size,
      url: URL.createObjectURL(archivo), // la foto se ve en el navegador sin subirla a ningún lado
    }
    lista.push(nueva)
    return copia(nueva) // ImagenProductoResponseDTO
  }

  if (metodo === 'DELETE') {
    buscar(lista, imagenId, noEncontrada)
    datos.imagenes[producto.id] = lista.filter((item) => item.id !== imagenId)
    return null
  }
}

async function productos(datos, peticion) {
  const { metodo, partes, query, body, token } = peticion
  const id = partes[1] ? Number(partes[1]) : null

  if (metodo === 'GET' && !id) {
    const categoriaId = Number(query.get('categoriaId')) || null
    const usuarioId = Number(query.get('usuarioId')) || null
    return copia(
      datos.productos.filter(
        (producto) =>
          (!categoriaId || producto.categoriaId === categoriaId) &&
          (!usuarioId || producto.usuarioId === usuarioId),
      ),
    )
  }

  if (metodo === 'POST' && !id) {
    const sesion = usuarioDeSesion(datos, token)
    validarProducto(datos, body)
    const { nombre, descripcion, precio, stock, categoriaId } = body
    const nuevo = { id: siguienteId(datos.productos), nombre, descripcion, precio, stock, categoriaId }
    nuevo.usuarioId = sesion.id // el back toma el vendedor del token, no del body
    datos.productos.push(nuevo)
    datos.imagenes[nuevo.id] = []
    return copia(nuevo)
  }

  const producto = buscar(datos.productos, id, new ApiError(404, `Producto con ID ${id} no encontrado`))
  if (partes[2] === 'imagenes') return imagenes(datos, peticion, producto)
  if (metodo === 'GET') return copia(producto)

  const sesion = usuarioDeSesion(datos, token)
  if (producto.usuarioId !== sesion.id) {
    throw new ApiError(403, `El producto con ID ${id} no pertenece al usuario`)
  }
  if (metodo === 'PUT') {
    validarProducto(datos, body)
    const { nombre, descripcion, precio, stock, categoriaId } = body
    Object.assign(producto, { nombre, descripcion, precio, stock, categoriaId })
    return copia(producto)
  }
  if (metodo === 'DELETE') {
    datos.productos = datos.productos.filter((item) => item.id !== id)
    delete datos.imagenes[id]
    return null
  }
}

async function carrito(datos, { metodo, partes, body, token }) {
  const sesion = usuarioDeSesion(datos, token)
  const propios = () => datos.carrito.filter((item) => item.usuarioId === sesion.id)

  if (metodo === 'GET') return copia(propios())

  if (metodo === 'POST' && partes[1] === 'checkout') {
    const items = propios()
    if (items.length === 0) throw new ApiError(400, `El carrito del usuario ${sesion.id} está vacío`)
    for (const item of items) {
      const producto = datos.productos.find((p) => p.id === item.productoId)
      if (!producto || producto.stock < item.cantidad) {
        throw new ApiError(400, `Producto con ID ${item.productoId} no tiene stock suficiente`)
      }
    }
    const pedidoItems = items.map((item) => {
      const producto = datos.productos.find((p) => p.id === item.productoId)
      producto.stock -= item.cantidad // el checkout descuenta el stock
      return {
        productoId: item.productoId,
        nombreProducto: item.nombreProducto,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
      }
    })
    const pedido = {
      pedidoId: datos.pedidos.length + 1,
      usuarioId: sesion.id,
      fecha: ahora(),
      total: pedidoItems.reduce((suma, item) => suma + item.precioUnitario * item.cantidad, 0),
      items: pedidoItems,
    }
    datos.pedidos.push(pedido)
    datos.carrito = datos.carrito.filter((item) => item.usuarioId !== sesion.id)
    return copia(pedido) // CheckoutResponseDTO
  }

  if (metodo === 'POST') {
    const cantidad = body?.cantidad ?? 1
    if (cantidad <= 0) throw new ApiError(400, 'La cantidad debe ser mayor a 0')
    const producto = buscar(
      datos.productos,
      body?.productoId,
      new ApiError(404, `Producto con ID ${body?.productoId} no encontrado`),
    )
    if (producto.usuarioId === sesion.id) {
      throw new ApiError(400, `No podés comprar tu propio producto (ID ${producto.id})`)
    }
    let item = propios().find((elemento) => elemento.productoId === producto.id)
    if (producto.stock < cantidad + (item?.cantidad ?? 0)) {
      throw new ApiError(400, `Producto con ID ${producto.id} no tiene stock suficiente`)
    }
    if (item) {
      item.cantidad += cantidad
    } else {
      item = {
        id: siguienteId(datos.carrito),
        usuarioId: sesion.id,
        productoId: producto.id,
        nombreProducto: producto.nombre,
        precio: producto.precio,
        cantidad,
      }
      datos.carrito.push(item)
    }
    return copia(item) // CarritoItemResponseDTO
  }

  if (metodo === 'DELETE' && partes[1] === 'items') {
    const itemId = Number(partes[2])
    const item = buscar(
      datos.carrito,
      itemId,
      new ApiError(404, `Item del carrito con ID ${itemId} no encontrado`),
    )
    if (item.usuarioId !== sesion.id) {
      throw new ApiError(403, `El item del carrito con ID ${itemId} no pertenece al usuario`)
    }
    datos.carrito = datos.carrito.filter((elemento) => elemento.id !== itemId)
    return null
  }

  if (metodo === 'DELETE') {
    datos.carrito = datos.carrito.filter((item) => item.usuarioId !== sesion.id)
    return null
  }
}

const RECURSOS = { usuarios, categorias, productos, carrito }

/**
 * Responde una petición como lo haría el back.
 * @param {string} ruta  La misma que recibe apiFetch, por ejemplo '/productos?categoriaId=2'
 * @param {{ method: string, body?: object | FormData, token?: string | null }} opciones
 * @returns {Promise<any>} El DTO de la respuesta, o null en los 204.
 * @throws {ApiError} Con el mismo status y mensaje que mandaría el back.
 */
export async function respuestaMock(ruta, { method, body, token }) {
  await esperar(DEMORA_MS)
  const [camino, textoQuery = ''] = ruta.split('?')
  const partes = camino.split('/').filter(Boolean) // '/productos/3/imagenes' -> ['productos', '3', 'imagenes']
  const recurso = RECURSOS[partes[0]]
  const datos = await obtenerDatos()

  const respuesta = recurso
    ? await recurso(datos, { metodo: method, partes, query: new URLSearchParams(textoQuery), body, token })
    : undefined

  if (respuesta === undefined) {
    throw new ApiError(404, `La ruta ${method} /api${ruta} no está simulada en los datos de prueba.`)
  }
  return respuesta
}
