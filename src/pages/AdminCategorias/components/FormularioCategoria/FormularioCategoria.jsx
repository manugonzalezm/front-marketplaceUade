import { Plus } from 'lucide-react'
import { useState } from 'react'
import CampoFormulario from '@/components/CampoFormulario/CampoFormulario'
import { MAX_NOMBRE_CATEGORIA, validarNombreCategoria } from '@/utils/validacionesCategoria'
import styles from './FormularioCategoria.module.css'

/**
 * Formulario para crear una categoría. Valida el nombre y se lo pasa a la vista;
 * si la vista confirma que se creó, limpia el campo.
 *
 * @param {object} props
 * @param {boolean} props.enviando
 * @param {(nombre: string) => Promise<boolean>} props.onCrear  Devuelve true si se creó.
 */
export default function FormularioCategoria({ enviando, onCrear }) {
  const [nombre, setNombre] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (evento) => {
    evento.preventDefault()
    const mensaje = validarNombreCategoria(nombre)
    setError(mensaje)
    if (mensaje) return
    const creada = await onCrear(nombre.trim())
    if (creada) setNombre('')
  }

  return (
    <form className={styles.formulario} onSubmit={handleSubmit} noValidate>
      <CampoFormulario
        etiqueta="Nueva categoría"
        name="nombre"
        placeholder="Ej.: Instrumentos musicales"
        maxLength={MAX_NOMBRE_CATEGORIA}
        value={nombre}
        error={error}
        onChange={(evento) => {
          setNombre(evento.target.value)
          if (error) setError(validarNombreCategoria(evento.target.value))
        }}
      />
      <button type="submit" className="boton boton-primario" disabled={enviando}>
        <Plus size={18} aria-hidden="true" />
        {enviando ? 'Creando…' : 'Crear'}
      </button>
    </form>
  )
}
