import { Minus, Plus } from 'lucide-react'
import { useId } from 'react'
import styles from './SelectorCantidad.module.css'

/**
 * Cantidad de unidades con botones − y +, entre 1 y el stock disponible.
 * Los botones en el límite usan aria-disabled en lugar de disabled para no perder el foco del teclado.
 *
 * @param {object} props
 * @param {number} props.cantidad
 * @param {number} props.maximo  El stock del producto.
 * @param {boolean} [props.deshabilitado]  Mientras se agrega a la compra.
 * @param {(cantidad: number) => void} props.onCambiar
 */
export default function SelectorCantidad({ cantidad, maximo, deshabilitado, onCambiar }) {
  const idEtiqueta = useId()
  const puedeRestar = !deshabilitado && cantidad > 1
  const puedeSumar = !deshabilitado && cantidad < maximo

  return (
    <div className={styles.selector}>
      <span id={idEtiqueta} className={styles.etiqueta}>
        Cantidad
      </span>
      <div role="group" aria-labelledby={idEtiqueta} className={styles.control}>
        <button
          type="button"
          className={styles.boton}
          aria-disabled={!puedeRestar}
          onClick={() => puedeRestar && onCambiar(cantidad - 1)}
        >
          <Minus size={18} aria-hidden="true" />
          <span className="solo-lectores">Restar una unidad</span>
        </button>
        <output className={styles.valor} aria-live="polite">
          {cantidad}
        </output>
        <button
          type="button"
          className={styles.boton}
          aria-disabled={!puedeSumar}
          onClick={() => puedeSumar && onCambiar(cantidad + 1)}
        >
          <Plus size={18} aria-hidden="true" />
          <span className="solo-lectores">Sumar una unidad</span>
        </button>
      </div>
    </div>
  )
}
