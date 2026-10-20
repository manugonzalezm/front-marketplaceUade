import { Pencil, Trash2 } from 'lucide-react'
import { generatePath, Link } from 'react-router'
import { PATHS } from '@/routes/paths'
import { formatearPrecio } from '@/utils/formato'
import FotoProducto from '@/pages/MisProductos/components/FotoProducto/FotoProducto'
import FotosPublicacion from '@/pages/MisProductos/components/FotosPublicacion/FotosPublicacion'
import styles from './FichaMiProducto.module.css'

/** Tarjeta de vendedor. Recibe datos y eventos; no consulta la API ni la sesión. */
export default function FichaMiProducto({ producto, imagenes, onEliminar, onEliminarFoto }) {
  const tieneStock = producto.stock > 0
  return (
    <article className={styles.ficha} aria-labelledby={`producto-${producto.id}`}>
      <div className={styles.portada}>
        <FotoProducto key={imagenes[0]?.url ?? 'sin-foto'} imagen={imagenes[0]} nombre={producto.nombre} />
        <span className={tieneStock ? styles.publicado : styles.pausado}>
          {tieneStock ? 'Publicado' : 'Sin stock · Pausado'}
        </span>
      </div>
      <div className={styles.contenido}>
        <h3 id={`producto-${producto.id}`}>{producto.nombre}</h3>
        <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>
        <p className={styles.stock}>
          {tieneStock
            ? `${producto.stock} ${producto.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}`
            : 'Actualizá el stock para volver a vender.'}
        </p>
        <div className={styles.acciones}>
          <Link
            className="boton boton-secundario"
            to={generatePath(PATHS.productoEditar, { id: producto.id })}
            aria-label={`Editar ${producto.nombre}`}
          >
            <Pencil size={18} aria-hidden="true" /> Editar
          </Link>
          <button
            type="button"
            className="boton boton-peligro"
            onClick={onEliminar}
            aria-label={`Eliminar ${producto.nombre}`}
          >
            <Trash2 size={18} aria-hidden="true" /> Eliminar
          </button>
        </div>
        <FotosPublicacion imagenes={imagenes} nombre={producto.nombre} onEliminar={onEliminarFoto} />
      </div>
    </article>
  )
}
