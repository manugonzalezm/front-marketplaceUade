import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router'
import { registrarUsuario } from '@/api/usuarios'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import FormularioRegistro from './components/FormularioRegistro/FormularioRegistro'
import styles from './RegistroPage.module.css'

/**
 * Registro de usuario. El back no devuelve token al registrarse: después del alta
 * se hace login automático con el mismo mail y contraseña. Si ese login falla,
 * se manda al usuario a /login con el mail completo y un aviso de que la cuenta
 * ya se creó.
 *
 * Endpoints:
 *   POST /api/usuarios/registro
 *     { nombreUsuario, mail, contrasena, nombre, apellido,
 *       fechaNacimiento: 'AAAA-MM-DD', sexo: 'MASCULINO' | 'FEMENINO' | 'OTRO' }
 *     -> UsuarioResponseDTO
 *   POST /api/usuarios/login (vía AuthContext)
 */
export default function RegistroPage() {
  const { estaLogueado, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState(null)

  const desde = location.state?.desde
  const destino = desde ? `${desde.pathname}${desde.search ?? ''}` : PATHS.inicio

  const handleSubmit = async (usuario) => {
    setEnviando(true)
    setError(null)

    try {
      await registrarUsuario(usuario)
    } catch (err) {
      setError(err.message) // ej.: mail o nombre de usuario ya registrado (409)
      setEnviando(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    try {
      await login(usuario.mail, usuario.contrasena)
      navigate(destino, { replace: true })
    } catch {
      navigate(PATHS.login, {
        replace: true,
        state: { mail: usuario.mail, mensaje: 'Tu cuenta se creó. Ingresá con tu mail y contraseña.', desde },
      })
    }
  }

  if (estaLogueado && !enviando) return <Navigate to={destino} replace />

  return (
    <div className={styles.pagina}>
      <EncabezadoPagina titulo="Crear cuenta" descripcion="Registrate para comprar y publicar productos." />

      <section className={styles.tarjeta} aria-label="Formulario de registro">
        {error && (
          <p role="alert" className={styles.error}>
            {error}
          </p>
        )}
        <FormularioRegistro enviando={enviando} onSubmit={handleSubmit} />
      </section>

      <p className={styles.alternativa}>
        ¿Ya tenés cuenta?{' '}
        <Link to={PATHS.login} state={desde ? { desde } : undefined}>
          Ingresá
        </Link>
      </p>
    </div>
  )
}
