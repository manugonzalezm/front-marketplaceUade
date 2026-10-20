import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'
import styles from './CampoFormulario.module.css'

/**
 * Campo de formulario con label, ayuda y mensaje de error accesibles
 * (aria-invalid + aria-describedby). Con `opciones` dibuja un <select>; con
 * tipo "password" suma un botón para mostrar u ocultar la contraseña.
 * Cualquier otra prop (value, onChange, onBlur, autoComplete, max...) va al input.
 *
 * <CampoFormulario etiqueta="Mail" name="mail" type="email" value={mail}
 *   onChange={handleChange} error={errores.mail} />
 *
 * @param {object} props
 * @param {string} props.etiqueta
 * @param {string} props.name
 * @param {string} [props.type]
 * @param {string} [props.error]  Mensaje de error; si viene, el campo se marca como inválido.
 * @param {string} [props.ayuda]  Texto de ayuda debajo del campo.
 * @param {Array<{ valor: string, texto: string }>} [props.opciones]  Si viene, se dibuja un <select>.
 */
export default function CampoFormulario({ etiqueta, name, type = 'text', error, ayuda, opciones, ...resto }) {
  const id = useId()
  const [contrasenaVisible, setContrasenaVisible] = useState(false)
  const idAyuda = ayuda ? `${id}-ayuda` : null
  const idError = error ? `${id}-error` : null
  const describedBy = [idError, idAyuda].filter(Boolean).join(' ') || undefined
  const esContrasena = type === 'password'

  const propsCampo = {
    id,
    name,
    'aria-invalid': error ? 'true' : undefined,
    'aria-describedby': describedBy,
    ...resto,
  }

  return (
    <div className={styles.campo}>
      <label htmlFor={id}>{etiqueta}</label>

      {opciones ? (
        <select {...propsCampo}>
          <option value="">Elegí una opción</option>
          {opciones.map(({ valor, texto }) => (
            <option key={valor} value={valor}>
              {texto}
            </option>
          ))}
        </select>
      ) : esContrasena ? (
        <div className={styles.conBoton}>
          <input {...propsCampo} type={contrasenaVisible ? 'text' : 'password'} />
          <button
            type="button"
            className={styles.verContrasena}
            aria-pressed={contrasenaVisible}
            onClick={() => setContrasenaVisible((visible) => !visible)}
          >
            {contrasenaVisible ? (
              <EyeOff size={20} aria-hidden="true" />
            ) : (
              <Eye size={20} aria-hidden="true" />
            )}
            <span className="solo-lectores">Mostrar contraseña</span>
          </button>
        </div>
      ) : (
        <input {...propsCampo} type={type} />
      )}

      {error && (
        <p id={idError} className={styles.error}>
          {error}
        </p>
      )}
      {ayuda && (
        <p id={idAyuda} className={styles.ayuda}>
          {ayuda}
        </p>
      )}
    </div>
  )
}
