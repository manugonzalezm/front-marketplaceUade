import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { crearServicioMisProductos } from './misProductosDemo.js'

async function datosDePrueba() {
  const leer = async (nombre) =>
    JSON.parse(
      await readFile(new URL(`../../public/demo-mis-productos/${nombre}.json`, import.meta.url), 'utf8'),
    )
  return { productos: await leer('productos'), imagenes: await leer('imagenes') }
}

test('filtra por vendedor, ordena y conserva publicaciones sin stock', async () => {
  const servicio = crearServicioMisProductos(datosDePrueba)
  const productos = await servicio.getMisProductos(1)
  assert.deepEqual(
    productos.map((producto) => producto.id),
    [101, 102, 103, 104],
  )
  assert.equal(productos.find((producto) => producto.id === 103).stock, 0)
  assert.deepEqual(
    (await servicio.getMisProductos(2)).map((producto) => producto.id),
    [201],
  )
  assert.deepEqual(await servicio.getMisProductos(3), [])
})

test('una baja elimina solo el producto propio y conserva al otro vendedor', async () => {
  const servicio = crearServicioMisProductos(datosDePrueba)
  assert.equal(await servicio.eliminarProducto(101, 1), null)
  assert.equal((await servicio.getMisProductos(1)).length, 3)
  assert.equal((await servicio.getMisProductos(2)).length, 1)
  await assert.rejects(servicio.getImagenesProducto(101, 1), { status: 404 })
})

test('impide ver fotos o eliminar productos y fotos de otro vendedor', async () => {
  const servicio = crearServicioMisProductos(datosDePrueba)
  await assert.rejects(servicio.getImagenesProducto(101, 2), { status: 403 })
  await assert.rejects(servicio.eliminarProducto(101, 2), { status: 403 })
  await assert.rejects(servicio.eliminarImagen(101, 1001, 2), { status: 403 })
  assert.equal((await servicio.getMisProductos(1)).length, 4)
  assert.equal((await servicio.getImagenesProducto(101, 1)).length, 2)
})

test('elimina una foto concreta y permite quitar la última sin eliminar el producto', async () => {
  const servicio = crearServicioMisProductos(datosDePrueba)
  const fotos = await servicio.getImagenesProducto(101, 1)
  await servicio.eliminarImagen(101, fotos[0].id, 1)
  assert.deepEqual(await servicio.getImagenesProducto(101, 1), [fotos[1]])
  await servicio.eliminarImagen(101, fotos[1].id, 1)
  assert.deepEqual(await servicio.getImagenesProducto(101, 1), [])
  assert.equal((await servicio.getMisProductos(1)).length, 4)
})

test('las respuestas no permiten mutar el estado del servicio ni los fixtures', async () => {
  const datos = await datosDePrueba()
  const servicio = crearServicioMisProductos(async () => datos)
  const productos = await servicio.getMisProductos(1)
  productos[0].usuarioId = 2
  const fotos = await servicio.getImagenesProducto(101, 1)
  fotos[0].url = 'modificada'
  await servicio.eliminarProducto(103, 1)
  assert.equal((await servicio.getMisProductos(1)).length, 3)
  assert.notEqual((await servicio.getImagenesProducto(101, 1))[0].url, 'modificada')
  assert.equal(datos.productos.length, 5)
})

test('una nueva instancia restablece las bajas de la demostración', async () => {
  const servicio = crearServicioMisProductos(datosDePrueba)
  await servicio.eliminarProducto(101, 1)
  const nuevoServicio = crearServicioMisProductos(datosDePrueba)
  assert.equal((await nuevoServicio.getMisProductos(1)).length, 4)
})

test('reintenta la carga después de un error y comparte solicitudes simultáneas', async () => {
  let llamadas = 0
  const servicio = crearServicioMisProductos(async () => {
    llamadas++
    if (llamadas === 1) throw new Error('Error de red simulado')
    return datosDePrueba()
  })
  await assert.rejects(servicio.getMisProductos(1), /Error de red/)
  const [propios, ajenos] = await Promise.all([servicio.getMisProductos(1), servicio.getMisProductos(2)])
  assert.equal(llamadas, 2)
  assert.equal(propios.length, 4)
  assert.equal(ajenos.length, 1)
})

test('rechaza identificadores inválidos y recursos inexistentes', async () => {
  const servicio = crearServicioMisProductos(datosDePrueba)
  await assert.rejects(servicio.getMisProductos(undefined), { status: 400 })
  await assert.rejects(servicio.getMisProductos(-1), { status: 400 })
  await assert.rejects(servicio.eliminarProducto(999, 1), { status: 404 })
  await assert.rejects(servicio.eliminarImagen(101, 999, 1), { status: 404 })
  await assert.rejects(servicio.eliminarImagen(101, 0, 1), { status: 400 })
})

test('rechaza datos mal formados y permite corregirlos al reintentar', async () => {
  let valido = false
  const servicio = crearServicioMisProductos(() =>
    valido ? datosDePrueba() : Promise.resolve({ productos: null }),
  )
  await assert.rejects(servicio.getMisProductos(1), { status: 500 })
  valido = true
  assert.equal((await servicio.getMisProductos(1)).length, 4)
})
