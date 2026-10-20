import { Check, Pencil, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import CampoFormulario from '@/components/CampoFormulario/CampoFormulario'
import { validarNombreCategoria } from '@/utils/validacionesCategoria'
import styles from './TablaCategorias.module.css'

/**
 * Listado de categorías con renombrar en el lugar y eliminar con confirmación.
 * No llama a la API: avisa a la vista con onRenombrar y onEliminar.
 *
 * @param {object} props
 * @param {Array<{ id: number, nombre: string }>} props.categorias
 * @param {number | null} props.ocupada  Id de la categoría que se está guardando o borrando.
 * @param {(id: number, nombre: string) => Promise<boolean>} props.onRenombrar  Devuelve true si se guardó.
 * @param {(id: number) => void} props.onEliminar
 */
export default function TablaCategorias({ categorias, ocupada, onRenombrar, onEliminar }) {
  const [editando, setEditando] = useState(null) // { id, nombre, error }
  const [confirmando, setConfirmando] = useState(null) // id a eliminar

  const handleGuardar = async (evento) => {
    evento.preventDefault()
    const error = validarNombreCategoria(editando.nombre)
    if (error) {
      setEditando({ ...editando, error })
      return
    }
    const guardada = await onRenombrar(editando.id, editando.nombre.trim())
    if (guardada) setEditando(null)
  }

  return (
    <ul className={styles.lista}>
      {categorias.map((categoria) => {
        const ocupadaEsta = ocupada === categoria.id

        if (editando?.id === categoria.id) {
          return (
            <li key={categoria.id} className={styles.fila}>
              <form className={styles.edicion} onSubmit={handleGuardar} noValidate>
                <CampoFormulario
                  etiqueta={`Nuevo nombre para ${categoria.nombre}`}
                  name="nombre"
                  value={editando.nombre}
                  error={editando.error}
                  autoFocus
                  onChange={(evento) => setEditando({ ...editando, nombre: evento.target.value, error: '' })}
                />
                <div className={styles.acciones}>
                  <button type="submit" className="boton boton-primario" disabled={ocupadaEsta}>
                    <Check size={18} aria-hidden="true" />
                    {ocupadaEsta ? 'Guardando…' : 'Guardar'}
                  </button>
                  <button type="button" className="boton boton-fantasma" onClick={() => setEditando(null)}>
                    Cancelar
                  </button>
                </div>
              </form>
            </li>
          )
        }

        return (
          <li key={categoria.id} className={styles.fila}>
            <div className={styles.datos}>
              <span className={styles.id}>#{categoria.id}</span>
              <span className={styles.nombre}>{categoria.nombre}</span>
            </div>

            {confirmando === categoria.id ? (
              <div role="alert" className={styles.confirmacion}>
                <span>¿Eliminar {categoria.nombre}?</span>
                <div className={styles.acciones}>
                  <button
                    type="button"
                    className="boton boton-peligro"
                    disabled={ocupadaEsta}
                    onClick={() => {
                      onEliminar(categoria.id)
                      setConfirmando(null)
                    }}
                  >
                    {ocupadaEsta ? 'Eliminando…' : 'Sí, eliminar'}
                  </button>
                  <button
                    type="button"
                    className="boton boton-secundario"
                    onClick={() => setConfirmando(null)}
                  >
                    <X size={18} aria-hidden="true" />
                    <span className="solo-lectores">Cancelar</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.acciones}>
                <button
                  type="button"
                  className="boton boton-secundario"
                  disabled={ocupada !== null}
                  onClick={() => setEditando({ id: categoria.id, nombre: categoria.nombre, error: '' })}
                >
                  <Pencil size={18} aria-hidden="true" />
                  Renombrar
                  <span className="solo-lectores"> {categoria.nombre}</span>
                </button>
                <button
                  type="button"
                  className="boton boton-fantasma"
                  disabled={ocupada !== null}
                  onClick={() => setConfirmando(categoria.id)}
                >
                  <Trash2 size={18} aria-hidden="true" />
                  Eliminar
                  <span className="solo-lectores"> {categoria.nombre}</span>
                </button>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
