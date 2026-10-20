import { formatearPrecio } from '@/utils/formato'
import styles from './ListaItemsCompra.module.css'

/**
 * Lista de solo lectura de los productos de una compra: nombre, cantidad, precio unitario y subtotal.
 * La usan el checkout (antes de confirmar) y la compra confirmada (el pedido que devolvió el back).
 *
 * @param {object} props
 * @param {Array<{ productoId: number, nombreProducto: string, cantidad: number, precioUnitario: number }>} props.items
 *   Mismo formato que los ítems de CheckoutResponseDTO. Los ítems de GET /api/carrito traen `precio` en lugar de
 *   `precioUnitario`: convertirlos antes de pasarlos.
 */
export default function ListaItemsCompra({ items }) {
  return (
    <ul className={styles.lista}>
      {items.map((item) => (
        <li key={item.productoId} className={styles.item}>
          <div className={styles.datos}>
            <p className={styles.nombre}>{item.nombreProducto}</p>
            <p className={styles.detalle}>
              {item.cantidad} {item.cantidad === 1 ? 'unidad' : 'unidades'} ×{' '}
              {formatearPrecio(item.precioUnitario)}
            </p>
          </div>
          <p className={styles.subtotal}>
            <span className="solo-lectores">Subtotal: </span>
            {formatearPrecio(item.cantidad * item.precioUnitario)}
          </p>
        </li>
      ))}
    </ul>
  )
}
