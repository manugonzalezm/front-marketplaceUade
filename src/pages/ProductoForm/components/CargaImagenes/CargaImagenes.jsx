import { ImagePlus, X } from 'lucide-react'
import { useId } from 'react'
import styles from './CargaImagenes.module.css'

/**
 * Selector de fotos con vista previa. No sube nada: avisa a quien lo usa qué
 * archivos eligió la persona (onAgregar) y cuál quiere quitar (onQuitar).
 *
 * @param {object} props
 * @param {Array<{ clave: string, url: string, nombre: string }>} props.fotos  Fotos a mostrar, en orden.
 * @param {number} props.maximo  Cantidad máxima de fotos por producto.
 * @param {string} [props.error]
 * @param {boolean} [props.deshabilitado]
 * @param {(archivos: File[]) => void} props.onAgregar
 * @param {(clave: string) => void} props.onQuitar
 */
export default function CargaImagenes({ fotos, maximo, error, deshabilitado, onAgregar, onQuitar }) {
  const id = useId()
  const idAyuda = `${id}-ayuda`
  const idError = `${id}-error`
  const lleno = fotos.length >= maximo

  const handleChange = (evento) => {
    onAgregar(Array.from(evento.target.files))
    evento.target.value = '' // permite volver a elegir el mismo archivo después de quitarlo
  }

  return (
    <fieldset className={styles.carga}>
      <legend className={styles.leyenda}>Fotos</legend>
      <p id={idAyuda} className={styles.ayuda}>
        Entre 1 y {maximo} fotos JPG, PNG o WebP de hasta 5 MB. La primera es la que se ve en el listado.
      </p>

      <label className={lleno || deshabilitado ? styles.zonaDeshabilitada : styles.zona}>
        <ImagePlus size={28} aria-hidden="true" />
        <span>{lleno ? `Ya cargaste ${maximo} fotos` : 'Elegí las fotos de tu producto'}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="solo-lectores"
          disabled={lleno || deshabilitado}
          aria-describedby={error ? `${idError} ${idAyuda}` : idAyuda}
          aria-invalid={error ? 'true' : undefined}
          onChange={handleChange}
        />
      </label>

      {error && (
        <p id={idError} role="alert" className={styles.error}>
          {error}
        </p>
      )}

      {fotos.length > 0 && (
        <ul className={styles.previas} aria-label={`${fotos.length} de ${maximo} fotos`}>
          {fotos.map((foto, indice) => (
            <li key={foto.clave} className={styles.previa}>
              <img src={foto.url} alt={`Foto ${indice + 1}: ${foto.nombre}`} className={styles.imagen} />
              {indice === 0 && <span className={styles.principal}>Principal</span>}
              <button
                type="button"
                className={styles.quitar}
                disabled={deshabilitado}
                onClick={() => onQuitar(foto.clave)}
              >
                <X size={16} aria-hidden="true" />
                <span className="solo-lectores">Quitar la foto {indice + 1}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  )
}
