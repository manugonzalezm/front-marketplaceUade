import { ImageOff } from 'lucide-react'
import { useState } from 'react'
import styles from './GaleriaImagenes.module.css'

/**
 * Foto grande del producto y, si tiene varias, miniaturas para cambiar la activa.
 * Si todavía no cargaron imágenes muestra un recuadro de reemplazo.
 *
 * @param {object} props
 * @param {Array<{ id: number, url: string, nombreArchivo: string }>} props.imagenes
 * @param {string} props.nombre  Nombre del producto (para el alt de la imagen).
 */
export default function GaleriaImagenes({ imagenes = [], nombre }) {
  const [seleccionada, setSeleccionada] = useState(0)

  if (imagenes.length === 0) {
    return (
      <div className={styles.sinImagen}>
        <ImageOff size={40} aria-hidden="true" />
        <span className={styles.ayuda}>Este producto todavía no tiene fotos.</span>
      </div>
    )
  }

  const actual = imagenes[seleccionada] ?? imagenes[0]

  return (
    <div className={styles.galeria}>
      <img className={styles.principal} src={actual.url} alt={nombre} />

      {imagenes.length > 1 && (
        <ul className={styles.miniaturas}>
          {imagenes.map((imagen, indice) => (
            <li key={imagen.id}>
              <button
                type="button"
                className={indice === seleccionada ? styles.miniaturaActiva : styles.miniatura}
                onClick={() => setSeleccionada(indice)}
                aria-label={`Ver la foto ${indice + 1} de ${nombre}`}
                aria-current={indice === seleccionada}
              >
                <img src={imagen.url} alt="" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
