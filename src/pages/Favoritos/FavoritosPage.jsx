import { Heart } from 'lucide-react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import ProductoCard from '@/components/ProductoCard/ProductoCard'
import { PATHS } from '@/routes/paths'
import styles from './FavoritosPage.module.css'

/**
 * Productos que el usuario marcó con el corazón. Viven en el store de Redux
 * (store.favorite.items) y se guardan en localStorage: no dependen del back.
 */
export default function FavoritosPage() {
  const favoritos = useSelector((store) => store.favorite.items)

  return (
    <>
      <EncabezadoPagina
        titulo="Favoritos"
        descripcion="Los productos que guardaste para volver a encontrarlos."
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Favoritos' }]}
      />

      {favoritos.length === 0 ? (
        <EstadoVacio
          icono={Heart}
          titulo="Todavía no guardaste favoritos"
          descripcion="Tocá el corazón de un producto para guardarlo acá y verlo cuando quieras."
        >
          <Link to={PATHS.inicio} className="boton boton-primario">
            Ver productos
          </Link>
        </EstadoVacio>
      ) : (
        <ul className={styles.grilla}>
          {favoritos.map((producto) => (
            <li key={producto.id}>
              <ProductoCard
                producto={producto}
                imagen={producto.imagenUrl ? { url: producto.imagenUrl } : null}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
