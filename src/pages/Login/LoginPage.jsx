import { CircleCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import FormularioLogin from './components/FormularioLogin/FormularioLogin'
import styles from './LoginPage.module.css'

/**
 * Login con mail y contraseña. Guarda el token y el usuario que devuelve el back
 * (AuthContext) y redirige a la página desde la que vino (location.state?.desde,
 * lo pone RutaPrivada) o al inicio.
 *
 * Endpoints:
 *   POST /api/usuarios/login   { mail, contrasena } -> { usuario, token }
 *
 * location.state opcional:
 *   desde    location a la que quería ir el usuario antes de que le pidieran ingresar
 *   mail     para completar el campo (ej. después de crear la cuenta)
 *   mensaje  aviso de éxito para mostrar arriba del formulario
 */
export default function LoginPage() {
  const { estaLogueado, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const desde = location.state?.desde
  const destino = desde ? `${desde.pathname}${desde.search ?? ''}` : PATHS.inicio

  const handleSubmit = async ({ mail, contrasena }) => {
    setEnviando(true)
    setError(null)
    try {
      await login(mail, contrasena)
      navigate(destino, { replace: true })
    } catch (err) {
      setError(err.message) // ej.: "Credenciales inválidas" que manda el back
      setEnviando(false)
    }
  }

  // Si ya tiene sesión (entró a /login a mano o volvió con "atrás"), no tiene sentido el formulario
  if (estaLogueado && !enviando) return <Navigate to={destino} replace />

  return (
    <div className={styles.pagina}>
      <EncabezadoPagina titulo="Ingresar" descripcion="Usá el mail y la contraseña de tu cuenta." />

      <section className={styles.tarjeta} aria-label="Formulario de ingreso">
        {location.state?.mensaje && !error && (
          <p role="status" className={styles.exito}>
            <CircleCheck size={20} aria-hidden="true" />
            {location.state.mensaje}
          </p>
        )}
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}

        <FormularioLogin mailInicial={location.state?.mail} enviando={enviando} onSubmit={handleSubmit} />
      </section>

      <p className={styles.alternativa}>
        ¿Todavía no tenés cuenta?{' '}
        <Link to={PATHS.registro} state={desde ? { desde } : undefined}>
          Creá tu cuenta
        </Link>
      </p>
    </div>
  )
}
