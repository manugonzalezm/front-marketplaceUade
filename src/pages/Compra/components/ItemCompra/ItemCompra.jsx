import { formatearPrecio } from '@/utils/formato'
import styles from './ItemCompra.module.css'

/** Ítem del carrito. Solo muestra los datos que recibe por props. */
export default function ItemCompra({ item }) {
  const subtotal = item.precio * item.cantidad

  return (
    <article className={styles.item} aria-labelledby={`item-${item.id}`}>
      <h3 id={`item-${item.id}`} className={styles.nombre}>
        {item.nombreProducto}
      </h3>
      <dl className={styles.detalle}>
        <div>
          <dt>Precio unitario</dt>
          <dd>{formatearPrecio(item.precio)}</dd>
        </div>
        <div>
          <dt>Cantidad</dt>
          <dd>{item.cantidad}</dd>
        </div>
        <div className={styles.subtotal}>
          <dt>Subtotal</dt>
          <dd>{formatearPrecio(subtotal)}</dd>
        </div>
      </dl>
    </article>
  )
}
