import { useRef, useState } from 'react'
import CampoFormulario from '@/components/CampoFormulario/CampoFormulario'
import {
  hoyIso,
  SEXOS,
  validarContrasena,
  validarFechaNacimiento,
  validarMail,
  validarNombreUsuario,
  validarObligatorio,
  validarSexo,
} from '@/utils/validacionesUsuario'
import styles from './FormularioRegistro.module.css'

const VALORES_INICIALES = {
  nombre: '',
  apellido: '',
  fechaNacimiento: '',
  sexo: '',
  nombreUsuario: '',
  mail: '',
  contrasena: '',
  confirmacion: '',
}

/** Un validador por campo, en el orden en que aparecen (para enfocar el primero con error). */
const VALIDADORES = {
  nombre: (valor) => validarObligatorio(valor, 'Ingresá tu nombre.'),
  apellido: (valor) => validarObligatorio(valor, 'Ingresá tu apellido.'),
  fechaNacimiento: validarFechaNacimiento,
  sexo: validarSexo,
  nombreUsuario: validarNombreUsuario,
  mail: validarMail,
  contrasena: (valor) => validarContrasena(valor),
  confirmacion: (valor, valores) => {
    if (!valor) return 'Repetí la contraseña.'
    return valor === valores.contrasena ? '' : 'Las contraseñas no coinciden.'
  },
}

/**
 * Formulario de alta de usuario. Valida con las mismas reglas que
 * UsuarioRequestDTO y le pasa a la vista el cuerpo listo para
 * POST /api/usuarios/registro (sin la confirmación de contraseña).
 *
 * @param {object} props
 * @param {boolean} props.enviando
 * @param {(usuario: { nombreUsuario: string, mail: string, contrasena: string, nombre: string,
 *   apellido: string, fechaNacimiento: string, sexo: string }) => void} props.onSubmit
 */
export default function FormularioRegistro({ enviando, onSubmit }) {
  const [valores, setValores] = useState(VALORES_INICIALES)
  const [errores, setErrores] = useState({})
  const formRef = useRef(null)

  const handleChange = (evento) => {
    const { name, value } = evento.target
    const nuevosValores = { ...valores, [name]: value }
    setValores(nuevosValores)

    // Se revalidan solo los campos que ya mostraban error, mientras el usuario los corrige.
    // Si cambia la contraseña, también la confirmación.
    const aRevalidar = [name, ...(name === 'contrasena' ? ['confirmacion'] : [])].filter(
      (campo) => errores[campo],
    )
    if (aRevalidar.length > 0) {
      setErrores((anteriores) => ({
        ...anteriores,
        ...Object.fromEntries(
          aRevalidar.map((campo) => [campo, VALIDADORES[campo](nuevosValores[campo], nuevosValores)]),
        ),
      }))
    }
  }

  // Al salir de un campo con algo escrito se valida, así el aviso llega antes del final
  const handleBlur = (evento) => {
    const { name, value } = evento.target
    if (value) setErrores((anteriores) => ({ ...anteriores, [name]: VALIDADORES[name](value, valores) }))
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    const nuevosErrores = Object.fromEntries(
      Object.entries(VALIDADORES).map(([campo, validar]) => [campo, validar(valores[campo], valores)]),
    )
    setErrores(nuevosErrores)

    const primerCampoConError = Object.keys(nuevosErrores).find((campo) => nuevosErrores[campo])
    if (primerCampoConError) {
      formRef.current?.elements[primerCampoConError]?.focus()
      return
    }

    onSubmit({
      nombreUsuario: valores.nombreUsuario.trim(),
      mail: valores.mail.trim(),
      contrasena: valores.contrasena,
      nombre: valores.nombre.trim(),
      apellido: valores.apellido.trim(),
      fechaNacimiento: valores.fechaNacimiento,
      sexo: valores.sexo,
    })
  }

  /** Props comunes de cada campo: valor, error y handlers. */
  const campo = (name) => ({
    name,
    value: valores[name],
    error: errores[name],
    onChange: handleChange,
    onBlur: handleBlur,
  })

  return (
    <form ref={formRef} className={styles.formulario} onSubmit={handleSubmit} noValidate>
      <fieldset className={styles.grupo}>
        <legend className={styles.leyenda}>Datos personales</legend>
        <div className={styles.columnas}>
          <CampoFormulario etiqueta="Nombre" autoComplete="given-name" {...campo('nombre')} />
          <CampoFormulario etiqueta="Apellido" autoComplete="family-name" {...campo('apellido')} />
          <CampoFormulario
            etiqueta="Fecha de nacimiento"
            type="date"
            autoComplete="bday"
            max={hoyIso()}
            {...campo('fechaNacimiento')}
          />
          <CampoFormulario etiqueta="Sexo" opciones={SEXOS} {...campo('sexo')} />
        </div>
      </fieldset>

      <fieldset className={styles.grupo}>
        <legend className={styles.leyenda}>Datos de acceso</legend>
        <div className={styles.columnas}>
          <CampoFormulario
            etiqueta="Nombre de usuario"
            autoComplete="username"
            ayuda="Entre 3 y 30 caracteres. Es el nombre que ven los demás."
            {...campo('nombreUsuario')}
          />
          <CampoFormulario
            etiqueta="Mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            ayuda="Lo vas a usar para ingresar."
            {...campo('mail')}
          />
          <CampoFormulario
            etiqueta="Contraseña"
            type="password"
            autoComplete="new-password"
            ayuda="Entre 8 y 72 caracteres, con al menos una letra y un número."
            {...campo('contrasena')}
          />
          <CampoFormulario
            etiqueta="Repetí la contraseña"
            type="password"
            autoComplete="new-password"
            {...campo('confirmacion')}
          />
        </div>
      </fieldset>

      <button type="submit" className="boton boton-primario boton-bloque" disabled={enviando}>
        {enviando ? 'Creando cuenta…' : 'Crear cuenta'}
      </button>
    </form>
  )
}
