import { Link } from 'react-router'
import { PATHS } from '@/routes/paths'
import { formatearPrecio } from '@/utils/formato'
import styles from './ResumenCompra.module.css'

/** Cantidad de productos, total y acceso al checkout. */
export default function ResumenCompra({ items }) {
  const total = items.reduce((suma, item) => suma + item.precio * item.cantidad, 0)

  return (
    <aside className={styles.resumen} aria-labelledby="titulo-resumen">
      <h2 id="titulo-resumen" className={styles.titulo}>
        Resumen
      </h2>
      <p className={styles.cantidad}>
        {items.length} {items.length === 1 ? 'producto' : 'productos'}
      </p>
      <div className={styles.total}>
        <span>Total</span>
        <strong>{formatearPrecio(total)}</strong>
      </div>
      <Link to={PATHS.checkout} className="boton boton-primario boton-bloque">
        Ir al checkout
      </Link>
    </aside>
  )
}
