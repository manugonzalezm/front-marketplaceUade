import styles from './Cargando.module.css'

/**
 * Spinner circular con un texto abajo, para mientras una pantalla trae sus datos.
 * Los lectores de pantalla anuncian el texto (role="status").
 *
 * <Cargando texto="Cargando productos…" />
 *
 * @param {{ texto?: string }} props
 */
export default function Cargando({ texto = 'Cargando…' }) {
  return (
    <div className={styles.cargando} role="status">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.texto}>{texto}</span>
    </div>
  )
}
