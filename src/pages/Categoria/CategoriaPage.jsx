import { CircleAlert, PackageOpen, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { getCategoria } from '@/api/categorias'
import { getProductoImagenes, getProductos } from '@/api/productos'
import Cargando from '@/components/Cargando/Cargando'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import ProductoCard from '@/components/ProductoCard/ProductoCard'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import styles from './CategoriaPage.module.css'

/**
 * Productos de una categoría que el usuario puede comprar, ordenados por nombre: con stock y publicados por
 * otros (los del usuario logueado no aparecen; sin sesión se ven todos).
 *
 * Endpoints:
 *   GET /api/categorias/{id}
 *   GET /api/productos?categoriaId={id}   (trae también los de stock 0 y los propios: se filtran acá)
 *   GET /api/productos/{id}/imagenes      (una por producto, para la foto de la tarjeta)
 */
export default function CategoriaPage() {
  const { id } = useParams()
  const { usuario } = useAuth()
  const usuarioId = usuario?.id ?? null
  const [intento, setIntento] = useState(0)
  const [resultado, setResultado] = useState(null)

  // El resultado guarda para qué categoría, usuario e intento se cargó: si cambia alguno (por ejemplo, se elige
  // otra categoría en el header), la pantalla muestra el spinner en lugar de los productos anteriores.
  const clave = `${id}|${usuarioId}|${intento}`

  useEffect(() => {
    let cancelado = false // evita actualizar el estado si el usuario ya se fue de la página
    cargarCategoria(Number(id), usuarioId)
      .then((datos) => {
        if (!cancelado) setResultado({ clave, ...datos })
      })
      .catch((err) => {
        if (!cancelado) {
          setResultado({ clave, error: err.message, noEncontrada: err.status === 404 || err.status === 400 })
        }
      })
    return () => {
      cancelado = true
    }
  }, [clave, id, usuarioId])

  // Mientras carga, solo el spinner: así el título no pasa de "Categoría" al nombre real.
  if (resultado?.clave !== clave) return <Cargando texto="Cargando productos…" />

  // Si falla todavía no sabemos el nombre de la categoría.
  const encabezadoGenerico = (
    <EncabezadoPagina
      titulo="Categoría"
      migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Categoría' }]}
    />
  )

  if (resultado.noEncontrada) {
    return (
      <>
        {encabezadoGenerico}
        <EstadoVacio
          icono={SearchX}
          titulo="No encontramos esta categoría"
          descripcion="Puede que la hayan eliminado. Elegí otra en la barra de categorías o mirá todos los productos."
        >
          <Link to={PATHS.inicio} className="boton boton-primario">
            Ver todos los productos
          </Link>
        </EstadoVacio>
      </>
    )
  }

  if (resultado.error) {
    return (
      <>
        {encabezadoGenerico}
        <EstadoVacio
          icono={CircleAlert}
          titulo="No pudimos cargar los productos"
          descripcion={resultado.error}
        >
          <button type="button" className="boton boton-primario" onClick={() => setIntento((n) => n + 1)}>
            Reintentar
          </button>
          <Link to={PATHS.inicio} className="boton boton-secundario">
            Volver al inicio
          </Link>
        </EstadoVacio>
      </>
    )
  }

  const { categoria, productos, imagenes } = resultado
  const encabezado = (
    <EncabezadoPagina
      titulo={categoria.nombre}
      migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: categoria.nombre }]}
    />
  )

  if (productos.length === 0) {
    return (
      <div className={styles.contenido}>
        {encabezado}
        <EstadoVacio
          icono={PackageOpen}
          titulo={`Todavía no hay productos en ${categoria.nombre}`}
          descripcion="Cuando otros estudiantes publiquen algo en esta categoría, lo vas a ver acá."
        >
          <Link to={PATHS.inicio} className="boton boton-primario">
            Ver todos los productos
          </Link>
          <Link to={PATHS.productoNuevo} className="boton boton-secundario">
            Publicar producto
          </Link>
        </EstadoVacio>
      </div>
    )
  }

  return (
    <div className={styles.contenido}>
      {encabezado}
      <p className={styles.cantidad}>
        {productos.length} {productos.length === 1 ? 'producto disponible' : 'productos disponibles'}
      </p>
      <ul className={styles.grilla}>
        {productos.map((producto) => (
          <li key={producto.id}>
            <ProductoCard producto={producto} imagen={imagenes[producto.id]} />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Trae la categoría y sus productos comprables (stock > 0 y de otro vendedor), ordenados por nombre, con la
 * primera foto de cada uno. Si las fotos fallan, el producto se muestra igual sin foto.
 * @returns {Promise<{ categoria: object, productos: object[], imagenes: Record<number, object | null> }>}
 */
async function cargarCategoria(categoriaId, usuarioId) {
  if (!Number.isInteger(categoriaId) || categoriaId <= 0) {
    throw Object.assign(new Error('Categoría inválida'), { status: 404 }) // ej.: /categorias/abc
  }

  const [categoria, todos] = await Promise.all([getCategoria(categoriaId), getProductos({ categoriaId })])
  const productos = todos
    .filter((producto) => producto.stock > 0 && producto.usuarioId !== usuarioId)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))

  const listas = await Promise.all(
    productos.map((producto) => getProductoImagenes(producto.id).catch(() => [])),
  )
  const imagenes = Object.fromEntries(productos.map((producto, i) => [producto.id, listas[i][0] ?? null]))

  return { categoria, productos, imagenes }
}
