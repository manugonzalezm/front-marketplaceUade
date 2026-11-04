import { Heart, ImageOff } from 'lucide-react'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generatePath, Link } from 'react-router'
import { PATHS } from '@/routes/paths'
import { addFavorite, removeFavorite } from '@/store/slices/favoriteSlice'
import { formatearPrecio } from '@/utils/formato'
import styles from './ProductoCard.module.css'

/**
 * Tarjeta de un producto en un listado (categoría, inicio). Toda la tarjeta lleva al detalle.
 *
 * <ul className={styles.grilla}>
 *   {productos.map((producto) => (
 *     <li key={producto.id}>
 *       <ProductoCard producto={producto} imagen={imagenes[producto.id]} />
 *     </li>
 *   ))}
 * </ul>
 *
 * @param {object} props
 * @param {{ id: number, nombre: string, precio: number, stock: number }} props.producto  ProductoResponseDTO.
 * @param {{ url: string } | null} [props.imagen]  La primera de GET /api/productos/{id}/imagenes, o null si no tiene.
 * @param {2 | 3} [props.nivelTitulo]  2 si la página no tiene otros títulos (categoría), 3 si va bajo un <h2>.
 */
export default function ProductoCard({ producto, imagen, nivelTitulo = 2 }) {
  const [falloImagen, setFalloImagen] = useState(false)
  const Titulo = `h${nivelTitulo}`
  const esUltimaUnidad = producto.stock === 1

  // REDUX - FUNCIONES: dispatch para pedirle cambios al favoriteSlice
  const dispatch = useDispatch()

  // REDUX - DATOS: la tarjeta se suscribe a store.favorite.items
  // esFavorito es true si este producto ya está en la lista de favoritos
  const esFavorito = useSelector((store) => store.favorite.items.some((item) => item.id === producto.id))

  // al tocar el ❤️: si ya es favorito lo quita, si no lo agrega
  const alternarFavorito = () => {
    if (esFavorito) {
      dispatch(removeFavorite(producto.id))
    } else {
      dispatch(addFavorite(producto))
    }
  }

  return (
    <article className={styles.tarjeta}>
      <button
        type="button"
        className={esFavorito ? `${styles.favorito} ${styles.favoritoActivo}` : styles.favorito}
        onClick={alternarFavorito}
        aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
        aria-pressed={esFavorito}
      >
        <Heart size={20} fill={esFavorito ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>

      {imagen?.url && !falloImagen ? (
        <img
          className={styles.foto}
          src={imagen.url}
          alt={producto.nombre}
          loading="lazy"
          onError={() => setFalloImagen(true)}
        />
      ) : (
        <div className={styles.sinFoto}>
          <ImageOff size={24} aria-hidden="true" />
          <span>{falloImagen ? 'Foto no disponible' : 'Sin fotos'}</span>
        </div>
      )}

      <div className={styles.cuerpo}>
        <Titulo className={styles.nombre}>
          <Link to={generatePath(PATHS.productoDetalle, { id: producto.id })} className={styles.link}>
            {producto.nombre}
          </Link>
        </Titulo>
        <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>
        <p className={esUltimaUnidad ? `${styles.stock} ${styles.ultimaUnidad}` : styles.stock}>
          {esUltimaUnidad ? 'Última unidad' : `${producto.stock} disponibles`}
        </p>
      </div>
    </article>
  )
}