import { CheckCircle2, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { eliminarUsuario, getUsuarios } from '@/api/usuarios'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { useAuth } from '@/hooks/useAuth'
import TablaUsuarios from './components/TablaUsuarios/TablaUsuarios'
import styles from './AdminUsuariosPage.module.css'

/**
 * Listado de usuarios del sitio (solo rol ADMIN), con opción de eliminar.
 *
 * Endpoints:
 *   GET    /api/usuarios
 *   DELETE /api/usuarios/{id}
 */
export default function AdminUsuariosPage() {
  const { usuario: sesion } = useAuth()
  const [usuarios, setUsuarios] = useState(null)
  const [errorCarga, setErrorCarga] = useState(null)
  const [ocupado, setOcupado] = useState(null) // id del usuario que se está eliminando
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    let cancelado = false // evita actualizar el estado si el usuario ya se fue de la página
    getUsuarios()
      .then((datos) => {
        if (!cancelado) setUsuarios(datos)
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(err.message)
      })
    return () => {
      cancelado = true
    }
  }, [])

  const handleEliminar = async (id) => {
    setError(null)
    setAviso(null)
    setOcupado(id)
    const usuario = usuarios.find((item) => item.id === id)
    try {
      await eliminarUsuario(id)
      setUsuarios((actuales) => actuales.filter((item) => item.id !== id))
      setAviso(`Eliminaste la cuenta de @${usuario.nombreUsuario}.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setOcupado(null)
    }
  }

  const administradores = usuarios?.filter((usuario) => usuario.rol === 'ADMIN').length ?? 0

  return (
    <div className={styles.pagina}>
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion="Todas las cuentas registradas en el sitio."
        migas={[{ texto: 'Administración' }, { texto: 'Usuarios' }]}
      />

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

      {errorCarga ? (
        <EstadoVacio icono={Users} titulo="No pudimos cargar los usuarios" descripcion={errorCarga} />
      ) : !usuarios ? (
        <p className="texto-suave">Cargando usuarios…</p>
      ) : (
        <section aria-labelledby="titulo-usuarios">
          <h2 id="titulo-usuarios" className={styles.subtitulo}>
            {usuarios.length} {usuarios.length === 1 ? 'cuenta' : 'cuentas'} · {administradores}{' '}
            {administradores === 1 ? 'administrador' : 'administradores'}
          </h2>
          <TablaUsuarios
            usuarios={usuarios}
            idPropio={sesion.id}
            ocupado={ocupado}
            onEliminar={handleEliminar}
          />
        </section>
      )}
    </div>
  )
}
