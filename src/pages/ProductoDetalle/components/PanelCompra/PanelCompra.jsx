import { formatearPrecio } from '@/utils/formato'
import styles from './PanelCompra.module.css'

/**
 * Precio, stock disponible y botón para agregar el producto a la compra en curso.
 * Con stock 0 el botón queda deshabilitado.
 *
 * @param {object} props
 * @param {{ precio: number, stock: number }} props.producto
 * @param {boolean} props.agregando
 * @param {() => void} props.onAgregar
 */
export default function PanelCompra({ producto, agregando, onAgregar }) {
  const tieneStock = producto.stock > 0

  return (
    <aside className={styles.panel}>
      <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>

      {tieneStock ? (
        <p className={styles.stock}>{producto.stock} disponibles</p>
      ) : (
        <p className={styles.sinStock}>Sin stock</p>
      )}

      <button
        type="button"
        className="boton boton-primario boton-bloque"
        disabled={!tieneStock || agregando}
        onClick={onAgregar}
      >
        {agregando ? 'Agregando…' : 'Agregar a mi compra'}
      </button>
    </aside>
  )
}
