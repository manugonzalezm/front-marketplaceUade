import { Trash2 } from 'lucide-react'
import { formatearPrecio } from '@/utils/formato'
import styles from './ItemCompra.module.css'

/** Ítem del carrito. Solo muestra los datos y avisa cuando se quiere eliminar. */
export default function ItemCompra({ item, eliminando = false, deshabilitado = false, onEliminar }) {
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
      <button
        type="button"
        className={`boton boton-peligro boton-bloque ${styles.eliminar}`}
        onClick={onEliminar}
        disabled={deshabilitado}
        aria-busy={eliminando}
        aria-label={
          eliminando
            ? `Eliminando ${item.nombreProducto} de mi compra`
            : `Eliminar ${item.nombreProducto} de mi compra`
        }
      >
        <Trash2 size={18} aria-hidden="true" />
        {eliminando ? 'Eliminando…' : 'Eliminar'}
      </button>
    </article>
  )
}
