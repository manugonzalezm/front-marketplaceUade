import { useState } from 'react'
import { formatearPrecio } from '@/utils/formato'
import SelectorCantidad from '../SelectorCantidad/SelectorCantidad'
import styles from './PanelCompra.module.css'

/**
 * Precio, stock disponible y botón para agregar el producto a la compra en curso.
 * Con stock mayor a 1 se elige la cantidad con − y + (arranca en 1). Con stock 0 el botón queda deshabilitado.
 * La vista lo renderiza con key={producto.id} para que la cantidad vuelva a 1 al cambiar de producto.
 *
 * @param {object} props
 * @param {{ precio: number, stock: number }} props.producto
 * @param {boolean} props.agregando
 * @param {(cantidad: number) => void} props.onAgregar
 */
export default function PanelCompra({ producto, agregando, onAgregar }) {
  const [cantidad, setCantidad] = useState(1)
  const tieneStock = producto.stock > 0
  const eligeCantidad = producto.stock > 1

  return (
    <aside className={styles.panel}>
      <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>

      {tieneStock ? (
        <p className={styles.stock}>{producto.stock} disponibles</p>
      ) : (
        <p className={styles.sinStock}>Sin stock</p>
      )}

      {eligeCantidad && (
        <SelectorCantidad
          cantidad={cantidad}
          maximo={producto.stock}
          deshabilitado={agregando}
          onCambiar={setCantidad}
        />
      )}

      <button
        type="button"
        className="boton boton-primario boton-bloque"
        disabled={!tieneStock || agregando}
        onClick={() => onAgregar(cantidad)}
      >
        {agregando ? 'Agregando…' : 'Agregar a mi compra'}
      </button>
    </aside>
  )
}
