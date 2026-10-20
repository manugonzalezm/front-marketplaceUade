import { CircleCheck } from 'lucide-react'
import ListaItemsCompra from '@/components/ListaItemsCompra/ListaItemsCompra'
import { formatearFecha, formatearNumeroPedido, formatearPrecio } from '@/utils/formato'
import styles from './DetallePedido.module.css'

/**
 * Comprobante del pedido recién confirmado: número, fecha, medio de pago, productos y total.
 *
 * @param {object} props
 * @param {{ pedidoId: number, fecha: string, total: number,
 *           items: Array<{ productoId: number, nombreProducto: string, cantidad: number, precioUnitario: number }> }} props.pedido
 *   La respuesta de POST /api/carrito/checkout (CheckoutResponseDTO).
 * @param {{ id: string, nombre: string }} [props.medioPago]  El elegido en el checkout.
 */
export default function DetallePedido({ pedido, medioPago }) {
  const unidades = pedido.items.reduce((suma, item) => suma + item.cantidad, 0)

  return (
    <article className={styles.detalle} aria-labelledby="pedido-numero">
      <header className={styles.cabecera}>
        <span className={styles.estado}>
          <CircleCheck size={16} aria-hidden="true" />
          Confirmada
        </span>
        <h2 id="pedido-numero" className={styles.numero}>
          Pedido N.º {formatearNumeroPedido(pedido.pedidoId)}
        </h2>
      </header>

      <dl className={styles.datos}>
        <div className={styles.dato}>
          <dt>Fecha</dt>
          <dd>{formatearFecha(pedido.fecha)}</dd>
        </div>
        <div className={styles.dato}>
          <dt>Medio de pago</dt>
          <dd>{medioPago?.nombre ?? 'Sin informar'}</dd>
        </div>
        <div className={styles.dato}>
          <dt>Unidades</dt>
          <dd>{unidades}</dd>
        </div>
      </dl>

      <section className={styles.productos} aria-labelledby="pedido-productos">
        <h3 id="pedido-productos" className={styles.subtitulo}>
          Productos
        </h3>
        <ListaItemsCompra items={pedido.items} />
      </section>

      <dl className={styles.total}>
        <dt>Total</dt>
        <dd>{formatearPrecio(pedido.total)}</dd>
      </dl>
    </article>
  )
}
