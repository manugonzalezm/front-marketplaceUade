import { ShoppingBag, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generatePath, Link, NavLink } from 'react-router'
import { getCategorias } from '@/api/categorias'
import Logo from '@/components/Logo/Logo'
import { PATHS } from '@/routes/paths'
import Buscador from './Buscador/Buscador'
import MenuCuenta from './MenuCuenta/MenuCuenta'
import MenuMovil from './MenuMovil/MenuMovil'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [categorias, setCategorias] = useState([])

  useEffect(() => {
    let cancelado = false
    getCategorias()
      .then((datos) => {
        if (!cancelado && Array.isArray(datos)) setCategorias(datos)
      })
      // Sin back corriendo la barra de categorías simplemente no se muestra.
      .catch(() => {})
    return () => {
      cancelado = true
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
          <div className={styles.cuenta}>
            <MenuCuenta />
          </div>
          <NavLink to={PATHS.compra} end className={styles.compra}>
            <ShoppingBag size={22} aria-hidden="true" />
            <span className={styles.compraTexto}>Mi compra</span>
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
