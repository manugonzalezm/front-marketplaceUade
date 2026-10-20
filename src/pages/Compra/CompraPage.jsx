import { PackageX, RefreshCw, ShoppingCart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { eliminarItemCarrito, getCarrito } from '@/api/carrito'
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
  const [errorEliminacion, setErrorEliminacion] = useState('')
  const [aviso, setAviso] = useState('')
  const [eliminandoId, setEliminandoId] = useState(null)
  const [intento, setIntento] = useState(0)
  const operacionEnCurso = useRef(false)
  const montada = useRef(false)
  const avisoRef = useRef(null)

  useEffect(() => {
    montada.current = true
    return () => {
      montada.current = false
    }
  }, [])

  useEffect(() => {
    if (aviso) avisoRef.current?.focus()
  }, [aviso])

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

  const handleEliminar = async (item) => {
    if (operacionEnCurso.current) return
    operacionEnCurso.current = true
    setEliminandoId(item.id)
    setErrorEliminacion('')
    setAviso('')
    try {
      await eliminarItemCarrito(item.id)
      if (!montada.current) return
      setItems((actuales) => actuales.filter((elemento) => elemento.id !== item.id))
      setAviso(`Eliminaste ${item.nombreProducto} de mi compra.`)
    } catch (err) {
      if (montada.current)
        setErrorEliminacion(err.message || 'No pudimos eliminar el producto. Probá de nuevo.')
    } finally {
      operacionEnCurso.current = false
      if (montada.current) setEliminandoId(null)
    }
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Mi compra"
        descripcion="Revisá los productos que elegiste antes de confirmar la compra."
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Mi compra' }]}
      />

      {errorEliminacion && (
        <p role="alert" className={styles.error}>
          {errorEliminacion}
        </p>
      )}
      {aviso && (
        <p ref={avisoRef} role="status" className={styles.exito} tabIndex={-1}>
          {aviso}
        </p>
      )}

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
                  <ItemCompra
                    item={item}
                    eliminando={eliminandoId === item.id}
                    deshabilitado={eliminandoId !== null}
                    onEliminar={() => handleEliminar(item)}
                  />
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
