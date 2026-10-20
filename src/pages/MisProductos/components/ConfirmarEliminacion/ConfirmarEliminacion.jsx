import { TriangleAlert } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import styles from './ConfirmarEliminacion.module.css'

/** Diálogo modal nativo: foco contenido, Escape para cancelar y protección contra envíos repetidos. */
export default function ConfirmarEliminacion({
  titulo,
  descripcion,
  etiquetaConfirmar,
  confirmando,
  error,
  onConfirmar,
  onCancelar,
}) {
  const dialogo = useRef(null)
  const cancelar = useRef(null)
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
      <div className={styles.icono}>
        <TriangleAlert size={24} aria-hidden="true" />
      </div>
      <h2 id={`${id}-titulo`}>{titulo}</h2>
      <p id={`${id}-descripcion`}>{descripcion}</p>
      {error && (
        <p role="alert" className={styles.error}>
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
          {confirmando ? 'Eliminando…' : etiquetaConfirmar}
        </button>
      </div>
    </dialog>
  )
}
