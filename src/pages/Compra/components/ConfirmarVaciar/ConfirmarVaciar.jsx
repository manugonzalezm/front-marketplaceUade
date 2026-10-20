import { useEffect, useId, useRef } from 'react'
import styles from './ConfirmarVaciar.module.css'

/** Diálogo modal para vaciar mi compra. */
export default function ConfirmarVaciar({ cantidad, confirmando, error, onConfirmar, onCancelar }) {
  const dialogo = useRef(null)
  const cancelar = useRef(null)
  const errorRef = useRef(null)
  const id = useId()

  useEffect(() => {
    const elemento = dialogo.current
    const focoAnterior = document.activeElement
    elemento.showModal()
    cancelar.current.focus()
    return () => {
      elemento.close()
      if (focoAnterior instanceof HTMLElement && focoAnterior.isConnected) focoAnterior.focus()
    }
  }, [])

  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  return (
    <dialog
      ref={dialogo}
      className={styles.dialogo}
      aria-labelledby={`${id}-titulo`}
      aria-describedby={`${id}-descripcion`}
      aria-busy={confirmando}
      onCancel={(evento) => {
        evento.preventDefault()
        if (!confirmando) onCancelar()
      }}
    >
      <h2 id={`${id}-titulo`}>¿Seguro que querés vaciar tu compra?</h2>
      <p id={`${id}-descripcion`}>
        {cantidad === 1
          ? 'Se va a quitar 1 producto de tu compra.'
          : `Se van a quitar ${cantidad} productos de tu compra.`}{' '}
        Esta acción no se puede deshacer.
      </p>
      {error && (
        <p ref={errorRef} role="alert" className={styles.error} tabIndex={-1}>
          {error}
        </p>
      )}
      <div className={styles.acciones}>
        <button
          ref={cancelar}
          type="button"
          className="boton boton-secundario"
          onClick={onCancelar}
          disabled={confirmando}
        >
          Cancelar
        </button>
        <button type="button" className="boton boton-peligro" onClick={onConfirmar} disabled={confirmando}>
          {confirmando ? 'Vaciando…' : 'Vaciar mi compra'}
        </button>
      </div>
    </dialog>
  )
}
