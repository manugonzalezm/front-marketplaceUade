import { CircleAlert, PackageOpen, SearchX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { getCategorias } from '@/api/categorias'
import { getProductoImagenes, getProductos } from '@/api/productos'
import Cargando from '@/components/Cargando/Cargando'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import GrillaProductos from './components/GrillaProductos/GrillaProductos'
import ListaCategorias from './components/ListaCategorias/ListaCategorias'
import styles from './HomePage.module.css'

/** Inicio del catálogo: categorías, productos disponibles A→Z y búsqueda del header (?q=texto). */
export default function HomePage() {
  const [parametros] = useSearchParams()
  const busqueda = parametros.get('q')?.trim() ?? ''
  const { usuario } = useAuth()
  const usuarioId = usuario?.id ?? null
  const [intento, setIntento] = useState(0)
  const [resultado, setResultado] = useState(null)
  const clave = `${usuarioId}|${intento}`
  const cargando = resultado?.clave !== clave

  useEffect(() => {
    let cancelado = false
    cargarInicio(usuarioId)
      .then((datos) => {
        if (!cancelado) setResultado({ clave, ...datos })
      })
      .catch((err) => {
        if (!cancelado) setResultado({ clave, error: err.message })
      })
    return () => {
      cancelado = true
    }
  }, [clave, usuarioId])

  const productos =
    cargando || resultado.error
      ? []
      : resultado.productos.filter((producto) => normalizar(producto.nombre).includes(normalizar(busqueda)))

  return (
    <>
      <EncabezadoPagina
        titulo="Productos publicados"
        descripcion="Encontrá lo que necesitás entre lo que venden otros estudiantes."
      />
      {cargando ? (
        <Cargando texto="Cargando productos y categorías…" />
      ) : resultado.error ? (
        <div role="alert">
          <EstadoVacio icono={CircleAlert} titulo="No pudimos cargar el inicio" descripcion={resultado.error}>
            <button type="button" className="boton boton-primario" onClick={() => setIntento((n) => n + 1)}>
              Reintentar
            </button>
          </EstadoVacio>
        </div>
      ) : (
        <div className={styles.contenido}>
          <section aria-labelledby="categorias-inicio">
            <h2 id="categorias-inicio">Explorá por categoría</h2>
            <ListaCategorias categorias={resultado.categorias} />
          </section>

          <section aria-labelledby="productos-inicio">
            <div className={styles.encabezadoProductos}>
              <div>
                <h2 id="productos-inicio">
                  {busqueda ? `Resultados para “${busqueda}”` : 'Todos los productos'}
                </h2>
                <p className={styles.cantidad} role="status">
                  {productos.length}{' '}
                  {productos.length === 1 ? 'producto disponible' : 'productos disponibles'} · Orden A→Z
                </p>
              </div>
              {busqueda && (
                <Link to={PATHS.inicio} className="boton boton-secundario">
                  Ver todos
                </Link>
              )}
            </div>

            {productos.length > 0 ? (
              <GrillaProductos productos={productos} imagenes={resultado.imagenes} />
            ) : busqueda ? (
              <EstadoVacio
                icono={SearchX}
                titulo="No encontramos productos con ese nombre"
                descripcion="Probá con otra palabra en el buscador o volvé a ver todos los productos."
              />
            ) : (
              <EstadoVacio
                icono={PackageOpen}
                titulo="Todavía no hay productos disponibles"
                descripcion="Cuando otros estudiantes publiquen productos con stock, los vas a ver acá."
              >
                <Link to={PATHS.productoNuevo} className="boton boton-primario">
                  Publicar producto
                </Link>
              </EstadoVacio>
            )}
          </section>
        </div>
      )}
    </>
  )
}

/** Busca sin distinguir mayúsculas ni tildes: “algebra” encuentra “Álgebra”. */
function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

/**
 * Usa los DTO y el modo mock compartidos, sin modificar los JSON. Como en Categoría, oculta productos sin
 * stock y del usuario actual. Una foto fallida no impide consultar el catálogo.
 * @param {number | null} usuarioId
 * @returns {Promise<{ productos: object[], categorias: object[], imagenes: Record<number, object | null> }>}
 */
async function cargarInicio(usuarioId) {
  const [todos, categorias] = await Promise.all([getProductos(), getCategorias()])
  const productos = todos
    .filter((producto) => producto.stock > 0 && producto.usuarioId !== usuarioId)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }))
  const listas = await Promise.all(
    productos.map((producto) => getProductoImagenes(producto.id).catch(() => [])),
  )
  return {
    productos,
    categorias: [...categorias].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')),
    imagenes: Object.fromEntries(productos.map((producto, i) => [producto.id, listas[i][0] ?? null])),
  }
}
