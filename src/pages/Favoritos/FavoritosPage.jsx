import { CircleAlert, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { getProductoImagenes } from '@/api/productos'
import Cargando from '@/components/Cargando/Cargando'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import ProductoCard from '@/components/ProductoCard/ProductoCard'
import { useProductosActualizados } from '@/hooks/useProductosActualizados'
import { PATHS } from '@/routes/paths'
import styles from './FavoritosPage.module.css'

/**
 * Productos que el usuario marcó con el corazón. El store solo tiene los
 * favoritos del usuario con sesión iniciada: en modo mock salen de
 * localStorage y en modo real del back (GET /api/favoritos).
 */
export default function FavoritosPage() {
  const favoritos = useSelector((store) => store.favorite.items)
  const cargando = useSelector((store) => store.favorite.cargando)
  const error = useSelector((store) => store.favorite.error)
  // El store guarda una foto del producto al marcarlo; esto la refresca para que
  // el stock (y el resto de los datos) no quede viejo después de una compra.
  const actualizados = useProductosActualizados(favoritos)
  // En modo real el back no devuelve la foto: la buscamos solo para los que no la tienen.
  const [imagenes, setImagenes] = useState({})

  useEffect(() => {
    const sinFoto = favoritos.filter((producto) => !producto.imagenUrl)
    if (sinFoto.length === 0) return

    let cancelado = false
    Promise.all(
      sinFoto.map((producto) =>
        getProductoImagenes(producto.id)
          .then((lista) => [producto.id, lista[0]?.url ?? null])
          // Si el producto ya no existe o falla la imagen, la tarjeta muestra "Sin fotos".
          .catch(() => [producto.id, null]),
      ),
    ).then((pares) => {
      if (!cancelado) setImagenes((actual) => ({ ...actual, ...Object.fromEntries(pares) }))
    })

    return () => {
      cancelado = true
    }
  }, [favoritos])

  const imagenDe = (producto) => {
    const url = producto.imagenUrl ?? imagenes[producto.id]
    return url ? { url } : null
  }

  return (
    <>
      <EncabezadoPagina
        titulo="Favoritos"
        descripcion="Los productos que guardaste para volver a encontrarlos."
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Favoritos' }]}
      />

      {cargando && favoritos.length === 0 ? (
        <Cargando texto="Cargando favoritos…" />
      ) : error ? (
        <EstadoVacio icono={CircleAlert} titulo="No pudimos cargar tus favoritos" descripcion={error}>
          <Link to={PATHS.inicio} className="boton boton-primario">
            Volver al inicio
          </Link>
        </EstadoVacio>
      ) : favoritos.length === 0 ? (
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
          {favoritos.map((producto) => {
            // Datos frescos del producto, conservando la foto guardada en el favorito.
            const actual = { ...producto, ...actualizados[producto.id] }
            return (
              <li key={producto.id}>
                <ProductoCard producto={actual} imagen={imagenDe(actual)} />
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}
