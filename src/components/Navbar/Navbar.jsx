import { useState } from 'react'
import { generatePath, Link, NavLink } from 'react-router'
import { PATHS } from '../../routes/paths'
import styles from './Navbar.module.css'

// Los links con :id usan un id de ejemplo (1) mientras no existan los listados
// reales. TODO: "Categorías" pasa a ser un desplegable con GET /api/categorias.
const LINKS_PRINCIPALES = [
  { to: PATHS.inicio, texto: 'Inicio', end: true },
  { to: generatePath(PATHS.categoria, { id: 1 }), texto: 'Categorías' },
  { to: PATHS.productoNuevo, texto: 'Publicar' },
  { to: PATHS.misProductos, texto: 'Mis productos', end: true },
  { to: PATHS.perfil, texto: 'Mi perfil' },
]

// TODO (auth): mostrar solo si usuario.rol === 'ADMIN'.
const LINKS_ADMIN = [
  { to: PATHS.adminCategorias, texto: 'Categorías' },
  { to: PATHS.adminUsuarios, texto: 'Usuarios' },
]

// TODO (auth): sin sesión se muestran estos; con sesión, "Cerrar sesión".
const LINKS_CUENTA = [
  { to: PATHS.login, texto: 'Ingresar' },
  { to: PATHS.registro, texto: 'Crear cuenta' },
]

// Pantallas que todavía no tienen un link natural (se llega desde otras páginas).
// Solo se ven con `npm run dev`; borrar cuando esas páginas estén conectadas.
const LINKS_DESARROLLO = [
  { to: generatePath(PATHS.productoDetalle, { id: 1 }), texto: 'Detalle de producto' },
  { to: generatePath(PATHS.productoEditar, { id: 1 }), texto: 'Editar producto' },
  { to: PATHS.compraConfirmada, texto: 'Compra confirmada' },
]

const claseLink = ({ isActive }) => (isActive ? `${styles.link} ${styles.activo}` : styles.link)

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const cerrarMenu = () => setMenuAbierto(false)

  const renderLinks = (links) =>
    links.map(({ to, texto, end }) => (
      <li key={to}>
        <NavLink to={to} end={end} className={claseLink} onClick={cerrarMenu}>
          <span className={styles.texto}>{texto}</span>
        </NavLink>
      </li>
    ))

  return (
    <header className={styles.header}>
      <div className={`contenedor ${styles.barra}`}>
        <Link to={PATHS.inicio} className={styles.marca} onClick={cerrarMenu}>
          <LogoEtiqueta />
          Marketplace UADE
        </Link>

        <div className={styles.acciones}>
          <ul className={`${styles.cuenta} ${styles.soloEscritorio}`}>{renderLinks(LINKS_CUENTA)}</ul>
          <NavLink to={PATHS.compra} className={`boton boton-primario ${styles.compra}`} onClick={cerrarMenu}>
            <IconoBolsa />
            <span className={styles.textoCompra}>Mi compra</span>
          </NavLink>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={menuAbierto}
            aria-controls="menu-principal"
            onClick={() => setMenuAbierto((abierto) => !abierto)}
          >
            <IconoMenu abierto={menuAbierto} />
            <span className="solo-lectores">{menuAbierto ? 'Cerrar menú' : 'Abrir menú'}</span>
          </button>
        </div>
      </div>

      <nav
        id="menu-principal"
        aria-label="Principal"
        className={menuAbierto ? `${styles.menu} ${styles.menuAbierto}` : styles.menu}
      >
        <div className={`contenedor ${styles.menuInterno}`}>
          <ul className={styles.lista}>{renderLinks(LINKS_PRINCIPALES)}</ul>

          <div className={styles.grupo}>
            <span className={styles.grupoTitulo} id="titulo-admin">
              Administración
            </span>
            <ul className={styles.lista} aria-labelledby="titulo-admin">
              {renderLinks(LINKS_ADMIN)}
            </ul>
          </div>

          <ul className={`${styles.lista} ${styles.soloMovil}`}>{renderLinks(LINKS_CUENTA)}</ul>
        </div>

        {import.meta.env.DEV && (
          <div className={styles.desarrollo}>
            <div className={`contenedor ${styles.menuInterno}`}>
              <span className={styles.grupoTitulo} id="titulo-desarrollo">
                Atajos de desarrollo
              </span>
              <ul className={styles.lista} aria-labelledby="titulo-desarrollo">
                {renderLinks(LINKS_DESARROLLO)}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

function LogoEtiqueta() {
  return (
    <svg className={styles.logo} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path
        d="M4 6a2 2 0 0 1 2-2h9.2a2 2 0 0 1 1.4.6l11 11a2 2 0 0 1 0 2.8l-9.2 9.2a2 2 0 0 1-2.8 0l-11-11A2 2 0 0 1 4 15.2z"
        fill="var(--color-tinta)"
      />
      <circle cx="10" cy="10" r="2.6" fill="var(--color-resaltador)" />
    </svg>
  )
}

function IconoBolsa() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
      <path
        d="M6 8h12l-1 12H7L6 8zm3 0V7a3 3 0 0 1 6 0v1"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconoMenu({ abierto }) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
      {abierto ? (
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
    </svg>
  )
}
