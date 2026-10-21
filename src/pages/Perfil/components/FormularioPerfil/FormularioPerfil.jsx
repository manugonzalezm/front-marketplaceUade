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
import styles from './FormularioPerfil.module.css'

/** Un validador por campo, en el orden en que aparecen (para enfocar el primero con error). */
const VALIDADORES = {
  nombre: (valor) => validarObligatorio(valor, 'Ingresá tu nombre.'),
  apellido: (valor) => validarObligatorio(valor, 'Ingresá tu apellido.'),
  fechaNacimiento: validarFechaNacimiento,
  sexo: validarSexo,
  nombreUsuario: validarNombreUsuario,
  mail: validarMail,
  // En el perfil la contraseña es opcional: vacía significa "dejar la actual".
  contrasena: (valor) => validarContrasena(valor, { obligatoria: false }),
  confirmacion: (valor, valores) => {
    if (!valores.contrasena) return ''
    if (!valor) return 'Repetí la contraseña nueva.'
    return valor === valores.contrasena ? '' : 'Las contraseñas no coinciden.'
  },
}

/**
 * Formulario de Mi perfil. Arranca con los datos actuales y valida con las mismas
 * reglas que UsuarioRequestDTO. Le pasa a la vista el cuerpo listo para
 * PUT /api/usuarios/{id}; la contraseña solo va si se escribió una nueva.
 *
 * @param {object} props
 * @param {{ nombreUsuario: string, mail: string, nombre: string, apellido: string,
 *   fechaNacimiento: string, sexo: string }} props.usuario  UsuarioResponseDTO actual.
 * @param {boolean} props.enviando
 * @param {(usuario: object) => void} props.onSubmit
 */
export default function FormularioPerfil({ usuario, enviando, onSubmit }) {
  const [valores, setValores] = useState(() => ({
    nombre: usuario.nombre ?? '',
    apellido: usuario.apellido ?? '',
    fechaNacimiento: usuario.fechaNacimiento ?? '',
    sexo: usuario.sexo ?? '',
    nombreUsuario: usuario.nombreUsuario ?? '',
    mail: usuario.mail ?? '',
    contrasena: '',
    confirmacion: '',
  }))
  const [errores, setErrores] = useState({})
  const formRef = useRef(null)

  const handleChange = (evento) => {
    const { name, value } = evento.target
    const siguientes = { ...valores, [name]: value }
    setValores(siguientes)
    // Mientras corrige un campo que ya tenía error, se revalida en cada tecla.
    if (errores[name]) {
      setErrores((anteriores) => ({ ...anteriores, [name]: VALIDADORES[name](value, siguientes) }))
    }
  }

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
      nombre: valores.nombre.trim(),
      apellido: valores.apellido.trim(),
      fechaNacimiento: valores.fechaNacimiento,
      sexo: valores.sexo,
      ...(valores.contrasena && { contrasena: valores.contrasena }),
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
          <CampoFormulario etiqueta="Nombre de usuario" autoComplete="username" {...campo('nombreUsuario')} />
          <CampoFormulario
            etiqueta="Mail"
            type="email"
            inputMode="email"
            autoComplete="email"
            {...campo('mail')}
          />
          <CampoFormulario
            etiqueta="Contraseña nueva"
            type="password"
            autoComplete="new-password"
            ayuda="Dejala vacía para conservar la actual."
            {...campo('contrasena')}
          />
          <CampoFormulario
            etiqueta="Repetí la contraseña nueva"
            type="password"
            autoComplete="new-password"
            {...campo('confirmacion')}
          />
        </div>
      </fieldset>

      <button type="submit" className="boton boton-primario" disabled={enviando}>
        {enviando ? 'Guardando…' : 'Guardar cambios'}
      </button>
    </form>
  )
}
