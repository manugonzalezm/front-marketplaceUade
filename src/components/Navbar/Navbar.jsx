import { Heart, ShoppingBag, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generatePath, Link, NavLink } from 'react-router'
import { useSelector } from 'react-redux'
import { EVENTO_CATEGORIAS_ACTUALIZADAS, getCategorias } from '@/api/categorias'
import Logo from '@/components/Logo/Logo'
import { useCantidadCarrito } from '@/hooks/useCantidadCarrito'
import { PATHS } from '@/routes/paths'
import Buscador from './Buscador/Buscador'
import MenuCuenta from './MenuCuenta/MenuCuenta'
import MenuMovil from './MenuMovil/MenuMovil'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [categorias, setCategorias] = useState([])
  const cantidadCarrito = useCantidadCarrito()
  // REDUX: el Navbar se suscribe a store.favorite.items y solo LEE la cantidad
  const cantidadFavoritos = useSelector((store) => store.favorite.items.length)

  useEffect(() => {
    let cancelado = false

    const cargar = () => {
      getCategorias()
        .then((datos) => {
          if (!cancelado && Array.isArray(datos)) setCategorias(datos)
        })
        // Sin back corriendo la barra de categorías simplemente no se muestra.
        .catch(() => {})
    }

    cargar()
    window.addEventListener(EVENTO_CATEGORIAS_ACTUALIZADAS, cargar)
    return () => {
      cancelado = true
      window.removeEventListener(EVENTO_CATEGORIAS_ACTUALIZADAS, cargar)
    }
  }, [])

  return (
    <header className={styles.header}>
      <div className={`contenedor ${styles.principal}`}>
        <div className={styles.menuMovil}>
          <MenuMovil categorias={categorias} />
        </div>

        <Link to={PATHS.inicio} className={styles.marca} aria-label="Marketplace UADE, ir al inicio">
          <Logo />
        </Link>

        <div className={styles.buscador}>
          <Buscador />
        </div>

        <div className={styles.acciones}>
          <Link to={PATHS.productoNuevo} className={`boton boton-secundario ${styles.publicar}`}>
            <Plus size={18} aria-hidden="true" />
            Publicar
          </Link>
          <span className={styles.compra} title="Favoritos">
            <span className={styles.iconoCompra}>
              <Heart size={22} aria-hidden="true" />
              {cantidadFavoritos > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {cantidadFavoritos}
                </span>
              )}
            </span>
            <span className="solo-lectores">{`${cantidadFavoritos} favoritos`}</span>
          </span>
          <div className={styles.cuenta}>
            <MenuCuenta />
          </div>
          <NavLink to={PATHS.compra} end className={styles.compra}>
            <span className={styles.iconoCompra}>
              <ShoppingBag size={22} aria-hidden="true" />
              {cantidadCarrito > 0 && (
                <span className={styles.badge} aria-hidden="true">
                  {cantidadCarrito > 99 ? '99+' : cantidadCarrito}
                </span>
              )}
            </span>
            <span className={styles.compraTexto}>Mi compra</span>
            {cantidadCarrito > 0 && (
              <span className="solo-lectores">
                {`, ${cantidadCarrito} ${cantidadCarrito === 1 ? 'producto' : 'productos'}`}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {categorias.length > 0 && (
        <nav aria-label="Categorías" className={styles.categorias}>
          <ul className={`contenedor ${styles.listaCategorias}`}>
            {categorias.map((categoria) => (
              <li key={categoria.id}>
                <NavLink
                  to={generatePath(PATHS.categoria, { id: categoria.id })}
                  className={({ isActive }) =>
                    isActive ? `${styles.categoria} ${styles.categoriaActiva}` : styles.categoria
                  }
                >
                  {categoria.nombre}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}