import ListaItemsCompra from '@/components/ListaItemsCompra/ListaItemsCompra'
import styles from './ResumenProductos.module.css'

/**
 * Productos de la compra en curso, de solo lectura. Para cambiar cantidades o quitar productos el usuario vuelve
 * a "Mi compra".
 * @param {{ items: Array<{ productoId: number, nombreProducto: string, cantidad: number, precioUnitario: number }> }} props
 */
export default function ResumenProductos({ items }) {
  return (
    <section className={styles.resumen} aria-labelledby="checkout-productos">
      <div className={styles.cabecera}>
        <h2 id="checkout-productos" className={styles.titulo}>
          Productos
        </h2>
        <span className={styles.cantidad}>
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>
      <ListaItemsCompra items={items} />
    </section>
  )
}
