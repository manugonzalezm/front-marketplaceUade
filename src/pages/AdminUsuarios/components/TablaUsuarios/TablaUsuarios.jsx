import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { formatearFecha } from '@/utils/formato'
import styles from './TablaUsuarios.module.css'

/**
 * Tabla de usuarios registrados. Permite eliminar cuentas con confirmación,
 * salvo la propia (para eso está Mi perfil). No llama a la API.
 *
 * @param {object} props
 * @param {Array<{ id: number, nombreUsuario: string, mail: string, nombre: string, apellido: string,
 *   fechaNacimiento: string, rol: string }>} props.usuarios
 * @param {number} props.idPropio  Id del ADMIN logueado.
 * @param {number | null} props.ocupado  Id del usuario que se está eliminando.
 * @param {(id: number) => void} props.onEliminar
 */
export default function TablaUsuarios({ usuarios, idPropio, ocupado, onEliminar }) {
  const [confirmando, setConfirmando] = useState(null) // id a eliminar

  return (
    // En celular la tabla se desplaza dentro de su caja, sin mover la página.
    <div className={styles.contenedor} tabIndex={0} aria-label="Tabla de usuarios, se puede desplazar">
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th scope="col">Usuario</th>
            <th scope="col">Nombre</th>
            <th scope="col">Mail</th>
            <th scope="col">Nacimiento</th>
            <th scope="col">Rol</th>
            <th scope="col">
              <span className="solo-lectores">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td className={styles.usuario}>@{usuario.nombreUsuario}</td>
              <td>
                {usuario.nombre} {usuario.apellido}
              </td>
              <td>{usuario.mail}</td>
              <td>{formatearFecha(usuario.fechaNacimiento)}</td>
              <td>
                <span className={usuario.rol === 'ADMIN' ? styles.rolAdmin : styles.rol}>{usuario.rol}</span>
              </td>
              <td className={styles.acciones}>
                {usuario.id === idPropio ? (
                  <span className={styles.vos}>Sos vos</span>
                ) : confirmando === usuario.id ? (
                  <span role="alert" className={styles.confirmacion}>
                    <button
                      type="button"
                      className="boton boton-peligro"
                      disabled={ocupado === usuario.id}
                      onClick={() => {
                        onEliminar(usuario.id)
                        setConfirmando(null)
                      }}
                    >
                      {ocupado === usuario.id ? 'Eliminando…' : `Sí, eliminar a @${usuario.nombreUsuario}`}
                    </button>
                    <button
                      type="button"
                      className="boton boton-secundario"
                      onClick={() => setConfirmando(null)}
                    >
                      Cancelar
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="boton boton-fantasma"
                    disabled={ocupado !== null}
                    onClick={() => setConfirmando(usuario.id)}
                  >
                    <Trash2 size={18} aria-hidden="true" />
                    Eliminar
                    <span className="solo-lectores"> a @{usuario.nombreUsuario}</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
