import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import styles from './EliminarCuenta.module.css'

/**
 * Zona para dar de baja la cuenta. Pide confirmación antes de avisar a la vista.
 *
 * @param {object} props
 * @param {boolean} props.eliminando
 * @param {() => void} props.onEliminar
 */
export default function EliminarCuenta({ eliminando, onEliminar }) {
  const [confirmando, setConfirmando] = useState(false)

  return (
    <section className={styles.zona} aria-labelledby="titulo-eliminar-cuenta">
      <h2 id="titulo-eliminar-cuenta" className={styles.titulo}>
        Eliminar mi cuenta
      </h2>

      {confirmando ? (
        <div role="alert" className={styles.confirmacion}>
          <p className={styles.texto}>
            ¿Seguro? Se borran tu cuenta y tus datos. <strong>Esta acción no se puede deshacer.</strong>
          </p>
          <div className={styles.acciones}>
            <button type="button" className="boton boton-peligro" disabled={eliminando} onClick={onEliminar}>
              {eliminando ? 'Eliminando…' : 'Sí, eliminar mi cuenta'}
            </button>
            <button
              type="button"
              className="boton boton-secundario"
              disabled={eliminando}
              onClick={() => setConfirmando(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className={styles.texto}>Si eliminás tu cuenta vas a perder el acceso y tus publicaciones.</p>
          <button type="button" className="boton boton-peligro" onClick={() => setConfirmando(true)}>
            <Trash2 size={18} aria-hidden="true" />
            Eliminar cuenta
          </button>
        </>
      )}
    </section>
  )
}
