import { Images, Trash2 } from 'lucide-react'
import FotoProducto from '@/pages/MisProductos/components/FotoProducto/FotoProducto'
import styles from './FotosPublicacion.module.css'

/** @param {{ imagenes: object[], nombre: string, onEliminar: (imagen: object, indice: number) => void }} props */
export default function FotosPublicacion({ imagenes, nombre, onEliminar }) {
  if (imagenes.length === 0) return <p className={styles.sinFotos}>Podés agregar fotos desde Editar.</p>
  return (
    <details className={styles.galeria}>
      <summary aria-label={`Ver fotos de ${nombre} (${imagenes.length})`}>
        <Images size={18} aria-hidden="true" /> Ver fotos ({imagenes.length})
      </summary>
      <ul className={styles.fotos}>
        {imagenes.map((imagen, indice) => (
          <li key={imagen.id}>
            <FotoProducto key={imagen.url} imagen={imagen} nombre={`${nombre}, foto ${indice + 1}`} />
            <button
              type="button"
              className="boton boton-peligro"
              aria-label={`Eliminar foto ${indice + 1} de ${nombre}`}
              onClick={() => onEliminar(imagen, indice)}
            >
              <Trash2 size={16} aria-hidden="true" /> Eliminar
            </button>
          </li>
        ))}
      </ul>
    </details>
  )
}
