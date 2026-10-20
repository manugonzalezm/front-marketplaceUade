import { CheckCircle2, UserX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { actualizarUsuario, eliminarUsuario, getUsuario } from '@/api/usuarios'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import EliminarCuenta from './components/EliminarCuenta/EliminarCuenta'
import FormularioPerfil from './components/FormularioPerfil/FormularioPerfil'
import styles from './PerfilPage.module.css'

/**
 * Datos del usuario logueado, edición y baja de la cuenta.
 * Al editar, la contraseña es opcional: si no se manda, el back conserva la actual.
 *
 * Endpoints:
 *   GET    /api/usuarios/{id}
 *   PUT    /api/usuarios/{id}   (mismo body que el registro)
 *   DELETE /api/usuarios/{id}
 */
export default function PerfilPage() {
  const { usuario: sesion, logout } = useAuth()
  const navigate = useNavigate()
  const [usuario, setUsuario] = useState(null) // UsuarioResponseDTO actual
  const [errorCarga, setErrorCarga] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [eliminando, setEliminando] = useState(false)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [version, setVersion] = useState(0) // cambia al guardar para que el formulario tome los datos nuevos

  useEffect(() => {
    let cancelado = false // evita actualizar el estado si el usuario ya se fue de la página
    getUsuario(sesion.id)
      .then((datos) => {
        if (!cancelado) setUsuario(datos)
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(err.message)
      })
    return () => {
      cancelado = true
    }
  }, [sesion.id])

  const handleGuardar = async (datos) => {
    setEnviando(true)
    setError(null)
    setAviso(null)
    try {
      const actualizado = await actualizarUsuario(sesion.id, datos)
      setUsuario(actualizado)
      setVersion((valor) => valor + 1)
      setAviso('Guardaste los cambios de tu perfil.')
    } catch (err) {
      setError(err.message) // ej.: mail o nombre de usuario ya usado por otra cuenta (409)
    } finally {
      setEnviando(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleEliminar = async () => {
    setEliminando(true)
    setError(null)
    try {
      await eliminarUsuario(sesion.id)
      // Sin sesión, la ruta privada lleva al login: vamos directo ahí con el aviso.
      navigate(PATHS.login, { replace: true, state: { mensaje: 'Eliminaste tu cuenta.' } })
      logout()
    } catch (err) {
      setError(err.message)
      setEliminando(false)
    }
  }

  const encabezado = (
    <EncabezadoPagina
      titulo="Mi perfil"
      descripcion="Tus datos personales y de acceso."
      migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Mi perfil' }]}
    />
  )

  if (errorCarga) {
    return (
      <>
        {encabezado}
        <EstadoVacio icono={UserX} titulo="No pudimos cargar tu perfil" descripcion={errorCarga}>
          <Link to={PATHS.inicio} className="boton boton-secundario">
            Volver al inicio
          </Link>
        </EstadoVacio>
      </>
    )
  }

  return (
    <div className={styles.pagina}>
      {encabezado}
      {error && (
        <p role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <div role="status">
        {aviso && (
          <p className={styles.aviso}>
            <CheckCircle2 size={20} aria-hidden="true" />
            {aviso}
          </p>
        )}
      </div>

      {usuario ? (
        <>
          <section className={styles.tarjeta} aria-label="Datos de tu cuenta">
            <p className={styles.rol}>
              Cuenta {usuario.rol === 'ADMIN' ? 'de administración' : 'de usuario'} · @{usuario.nombreUsuario}
            </p>
            <FormularioPerfil key={version} usuario={usuario} enviando={enviando} onSubmit={handleGuardar} />
          </section>
          <EliminarCuenta eliminando={eliminando} onEliminar={handleEliminar} />
        </>
      ) : (
        <p className="texto-suave">Cargando tu perfil…</p>
      )}
    </div>
  )
}
