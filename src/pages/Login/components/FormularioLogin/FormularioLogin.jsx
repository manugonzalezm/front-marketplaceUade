import { useRef, useState } from 'react'
import CampoFormulario from '@/components/CampoFormulario/CampoFormulario'
import { validarMail, validarObligatorio } from '@/utils/validacionesUsuario'
import styles from './FormularioLogin.module.css'

const VALIDADORES = {
  mail: validarMail,
  contrasena: (valor) => validarObligatorio(valor, 'Ingresá tu contraseña.'),
}

/**
 * Formulario de ingreso con mail y contraseña. Valida antes de enviar con las
 * mismas reglas que LoginRequestDTO y le pasa los datos a la vista, que es la
 * que llama al back.
 *
 * @param {object} props
 * @param {string} [props.mailInicial]  Para completar el mail, por ejemplo después de registrarse.
 * @param {boolean} props.enviando
 * @param {(datos: { mail: string, contrasena: string }) => void} props.onSubmit
 */
export default function FormularioLogin({ mailInicial = '', enviando, onSubmit }) {
  const [valores, setValores] = useState({ mail: mailInicial, contrasena: '' })
  const [errores, setErrores] = useState({})
  const formRef = useRef(null)

  const handleChange = (evento) => {
    const { name, value } = evento.target
    setValores((anteriores) => ({ ...anteriores, [name]: value }))
    // Si el campo ya mostraba un error, se revalida mientras el usuario lo corrige
    if (errores[name]) setErrores((anteriores) => ({ ...anteriores, [name]: VALIDADORES[name](value) }))
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    const nuevosErrores = Object.fromEntries(
      Object.entries(VALIDADORES).map(([campo, validar]) => [campo, validar(valores[campo])]),
    )
    setErrores(nuevosErrores)

    const primerCampoConError = Object.keys(nuevosErrores).find((campo) => nuevosErrores[campo])
    if (primerCampoConError) {
      formRef.current?.elements[primerCampoConError]?.focus()
      return
    }
    onSubmit({ mail: valores.mail.trim(), contrasena: valores.contrasena })
  }

  return (
    <form ref={formRef} className={styles.formulario} onSubmit={handleSubmit} noValidate>
      <CampoFormulario
        etiqueta="Mail"
        name="mail"
        type="email"
        autoComplete="email"
        inputMode="email"
        value={valores.mail}
        onChange={handleChange}
        error={errores.mail}
      />
      <CampoFormulario
        etiqueta="Contraseña"
        name="contrasena"
        type="password"
        autoComplete="current-password"
        value={valores.contrasena}
        onChange={handleChange}
        error={errores.contrasena}
      />

      <button type="submit" className="boton boton-primario boton-bloque" disabled={enviando}>
        {enviando ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
