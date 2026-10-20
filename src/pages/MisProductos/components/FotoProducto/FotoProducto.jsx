import { ImageOff } from 'lucide-react'
import { useState } from 'react'
import styles from './FotoProducto.module.css'

/** Imagen con reemplazo accesible si falta o falla. El padre usa url como key. */
export default function FotoProducto({ imagen, nombre }) {
  const [fallo, setFallo] = useState(false)
  return imagen?.url && !fallo ? (
    <img
      className={styles.foto}
      src={imagen.url}
      alt={nombre}
      loading="lazy"
      onError={() => setFallo(true)}
    />
  ) : (
    <div className={styles.sinFoto} role="img" aria-label={`${nombre}: sin imagen disponible`}>
      <ImageOff size={24} aria-hidden="true" />
      <span>{fallo ? 'Foto no disponible' : 'Sin fotos'}</span>
    </div>
  )
}
