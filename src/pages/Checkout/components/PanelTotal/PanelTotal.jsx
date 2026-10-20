import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'
import { PATHS } from '@/routes/paths'
import { formatearPrecio } from '@/utils/formato'
import styles from './PanelTotal.module.css'

/**
 * Total de la compra, botón para confirmarla y link para volver a "Mi compra" a cambiar algo.
 *
 * @param {object} props
 * @param {number} props.unidades  Suma de las cantidades de todos los productos.
 * @param {number} props.total
 * @param {boolean} props.confirmando
 * @param {() => void} props.onConfirmar
 */
export default function PanelTotal({ unidades, total, confirmando, onConfirmar }) {
  return (
    <aside className={styles.panel} aria-labelledby="checkout-total">
      <h2 id="checkout-total" className={styles.titulo}>
        Total de la compra
      </h2>

      <dl className={styles.importes}>
        <div className={styles.fila}>
          <dt>
            Subtotal ({unidades} {unidades === 1 ? 'unidad' : 'unidades'})
          </dt>
          <dd>{formatearPrecio(total)}</dd>
        </div>
        <div className={`${styles.fila} ${styles.filaTotal}`}>
          <dt>Total</dt>
          <dd>{formatearPrecio(total)}</dd>
        </div>
      </dl>

      <div className={styles.acciones}>
        <button
          type="button"
          className="boton boton-primario boton-bloque"
          disabled={confirmando}
          onClick={onConfirmar}
        >
          {confirmando ? 'Confirmando…' : 'Confirmar compra'}
        </button>
        <Link to={PATHS.compra} className="boton boton-secundario boton-bloque">
          <ArrowLeft size={18} aria-hidden="true" />
          Volver a mi compra
        </Link>
      </div>
    </aside>
  )
}
