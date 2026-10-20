import styles from './SelectorMedioPago.module.css'

const ID_ERROR = 'medio-pago-error'

/**
 * Opciones de medio de pago como radio buttons. Una sola elegida a la vez.
 *
 * @param {object} props
 * @param {Array<{ id: string, nombre: string, descripcion: string, icono: import('react').ElementType }>} props.medios
 * @param {string | null} props.seleccionado  id del medio elegido, o null si todavía no eligió.
 * @param {string | null} [props.error]  Mensaje si intentó confirmar sin elegir.
 * @param {boolean} [props.deshabilitado]  Mientras se confirma la compra.
 * @param {(id: string) => void} props.onSeleccionar
 * @param {import('react').Ref<HTMLFieldSetElement>} [props.ref]  Para llevar el foco a las opciones si falta elegir.
 */
export default function SelectorMedioPago({
  medios,
  seleccionado,
  error,
  deshabilitado,
  onSeleccionar,
  ref,
}) {
  return (
    <fieldset
      ref={ref}
      className={styles.selector}
      disabled={deshabilitado}
      aria-describedby={error ? ID_ERROR : undefined}
    >
      <legend className={styles.leyenda}>
        <h2 className={styles.titulo}>Medio de pago</h2>
      </legend>

      {error && (
        <p id={ID_ERROR} role="alert" className={styles.error}>
          {error}
        </p>
      )}

      <div className={styles.opciones}>
        {medios.map(({ id, nombre, descripcion, icono: Icono }) => {
          const idInput = `medio-pago-${id}`
          return (
            <label key={id} htmlFor={idInput} className={styles.opcion}>
              <input
                type="radio"
                id={idInput}
                name="medioPago"
                value={id}
                checked={seleccionado === id}
                onChange={() => onSeleccionar(id)}
                aria-invalid={error ? 'true' : undefined}
                className={styles.radio}
              />
              <span className={styles.icono}>
                <Icono size={20} aria-hidden="true" />
              </span>
              <span className={styles.textos}>
                <span className={styles.nombre}>{nombre}</span>
                <span className={styles.descripcion}>{descripcion}</span>
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
