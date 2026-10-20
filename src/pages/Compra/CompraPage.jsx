import { PackageX, RefreshCw, ShoppingCart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getCarrito } from '@/api/carrito'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'
import ItemCompra from './components/ItemCompra/ItemCompra'
import ResumenCompra from './components/ResumenCompra/ResumenCompra'
import styles from './CompraPage.module.css'

export default function CompraPage() {
  const [items, setItems] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    let cancelado = false
    getCarrito()
      .then((datos) => {
        if (!cancelado) setItems(datos)
      })
      .catch((err) => {
        if (!cancelado) setError(err.message || 'No pudimos cargar tu compra. Probá de nuevo.')
      })
      .finally(() => {
        if (!cancelado) setCargando(false)
      })
    return () => {
      cancelado = true
    }
  }, [intento])

  const handleReintentar = () => {
    setError('')
    setCargando(true)
    setIntento((valor) => valor + 1)
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Mi compra"
        descripcion="Revisá los productos que elegiste antes de confirmar la compra."
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Mi compra' }]}
      />

      {cargando ? (
        <p role="status" className={styles.carga}>
          Cargando tu compra…
        </p>
      ) : error ? (
        <div role="alert">
          <EstadoVacio icono={PackageX} titulo="No pudimos cargar tu compra" descripcion={error}>
            <button type="button" className="boton boton-secundario" onClick={handleReintentar}>
              <RefreshCw size={18} aria-hidden="true" />
              Reintentar
            </button>
          </EstadoVacio>
        </div>
      ) : items.length === 0 ? (
        <EstadoVacio
          icono={ShoppingCart}
          titulo="Tu carrito está vacío"
          descripcion="Agregá productos desde el inicio para verlos acá antes de confirmar la compra."
        >
          <Link to={PATHS.inicio} className="boton boton-secundario">
            Volver al inicio
          </Link>
        </EstadoVacio>
      ) : (
        <div className={styles.contenido}>
          <section aria-labelledby="titulo-productos">
            <h2 id="titulo-productos" className={styles.tituloListado}>
              Productos
            </h2>
            <ul className={styles.listado} role="list">
              {items.map((item) => (
                <li key={item.id}>
                  <ItemCompra item={item} />
                </li>
              ))}
            </ul>
          </section>
          <ResumenCompra items={items} />
        </div>
      )}
    </>
  )
}
