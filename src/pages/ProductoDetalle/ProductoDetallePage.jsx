import { PackageX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { agregarAlCarrito } from '@/api/carrito'
import { getCategoria } from '@/api/categorias'
import { getProducto, getProductoImagenes } from '@/api/productos'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'
import GaleriaImagenes from './components/GaleriaImagenes/GaleriaImagenes'
import InfoProducto from './components/InfoProducto/InfoProducto'
import PanelCompra from './components/PanelCompra/PanelCompra'
import styles from './ProductoDetallePage.module.css'

/**
 * Detalle de producto: imagen ampliada, descripción, precio y stock.
 * Desde acá se agrega el producto a la compra en curso. Sin stock: mostrarlo y
 * no permitir agregarlo.
 *
 * Endpoints:
 *   GET  /api/productos/{id}
 *   GET  /api/productos/{id}/imagenes
 *   GET  /api/categorias/{categoriaId}
 *   POST /api/carrito   { productoId, cantidad }
 */
export default function ProductoDetallePage() {
  const { id } = useParams()
  const [producto, setProducto] = useState(null)
  const [imagenes, setImagenes] = useState([])
  const [categoria, setCategoria] = useState(null)
  const [error, setError] = useState(null)
  const [agregando, setAgregando] = useState(false)
  const [errorCompra, setErrorCompra] = useState(null)
  const [confirmacion, setConfirmacion] = useState(null)

  useEffect(() => {
    let cancelado = false // evita actualizar el estado si el usuario ya se fue de la página
    getProducto(id)
      .then((datos) => {
        if (cancelado) return null
        setError(null)
        setProducto(datos)
        // La categoría y las imágenes no son críticas: si fallan, seguimos sin ellas.
        return Promise.all([
          getProductoImagenes(datos.id).catch(() => []),
          getCategoria(datos.categoriaId).catch(() => null),
        ])
      })
      .then((resultados) => {
        if (cancelado || !resultados) return
        const [imagenesCargadas, categoriaCargada] = resultados
        setImagenes(imagenesCargadas)
        setCategoria(categoriaCargada)
      })
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })

    return () => {
      cancelado = true
    }
  }, [id])

  const handleAgregar = async () => {
    setAgregando(true)
    setErrorCompra(null)
    setConfirmacion(null)
    try {
      await agregarAlCarrito({ productoId: producto.id, cantidad: 1 })
      setConfirmacion('Agregamos el producto a tu compra.')
    } catch (err) {
      setErrorCompra({
        texto: err.status === 401 ? 'Necesitás ingresar para agregar productos a tu compra.' : err.message, // ej.: "No hay stock suficiente" que manda el back
        necesitaIngresar: err.status === 401,
      })
    } finally {
      setAgregando(false)
    }
  }

  if (error) {
    return (
      <EstadoVacio icono={PackageX} titulo="No pudimos mostrar el producto" descripcion={error}>
        <Link to={PATHS.inicio} className="boton boton-secundario">
          Volver al inicio
        </Link>
      </EstadoVacio>
    )
  }

  if (!producto || String(producto.id) !== id) return <p className="texto-suave">Cargando producto…</p>

  return (
    <>
      <EncabezadoPagina
        titulo={producto.nombre}
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: producto.nombre }]}
      />

      {errorCompra && (
        <p role="alert" className={styles.error}>
          {errorCompra.texto}
          {errorCompra.necesitaIngresar && (
            <>
              {' '}
              <Link to={PATHS.login}>Ingresar</Link>
            </>
          )}
        </p>
      )}

      {confirmacion && (
        <p role="status" className={styles.exito}>
          {confirmacion} <Link to={PATHS.compra}>Ir a mi compra</Link>
        </p>
      )}

      <div className={styles.contenido}>
        <div className={styles.columnaPrincipal}>
          <GaleriaImagenes imagenes={imagenes} nombre={producto.nombre} />
          <InfoProducto producto={producto} categoria={categoria} />
        </div>
        <PanelCompra producto={producto} agregando={agregando} onAgregar={handleAgregar} />
      </div>
    </>
  )
}
