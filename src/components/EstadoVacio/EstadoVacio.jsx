import styles from './EstadoVacio.module.css'

/**
 * Bloque para cuando no hay nada que mostrar: listados vacíos, búsquedas sin
 * resultados, errores de carga. Siempre que se pueda, con una acción para seguir.
 *
 * <EstadoVacio icono={Package} titulo="Todavía no publicaste productos"
 *   descripcion="Publicá lo que ya no usás y otros estudiantes lo pueden comprar.">
 *   <Link to={PATHS.productoNuevo} className="boton boton-primario">Publicar producto</Link>
 * </EstadoVacio>
 *
 * @param {object} props
 * @param {import('react').ElementType} [props.icono]  Ícono de lucide-react.
 * @param {string} props.titulo
 * @param {string} [props.descripcion]
 * @param {import('react').ReactNode} [props.children]  Acciones (botones o links).
 */
export default function EstadoVacio({ icono: Icono, titulo, descripcion, children }) {
  return (
    <section className={styles.estado}>
      {Icono && (
        <span className={styles.icono}>
          <Icono size={28} aria-hidden="true" />
        </span>
      )}
      <h2 className={styles.titulo}>{titulo}</h2>
      {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
      {children && <div className={styles.acciones}>{children}</div>}
    </section>
  )
}
