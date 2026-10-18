import { ChevronDown, CircleUser } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { PATHS } from '@/routes/paths'
import { LINKS_ADMIN, LINKS_CUENTA } from '../links'
import styles from './MenuCuenta.module.css'

/**
 * Menú desplegable "Mi cuenta" (escritorio). Se cierra al elegir una opción,
 * al hacer clic afuera o con Escape.
 *
 * TODO (auth): sin sesión mostrar solo el bloque de ingreso; con sesión, el
 * nombre del usuario en el botón, sus links y "Cerrar sesión" al final.
 */
export default function MenuCuenta() {
  const [abierto, setAbierto] = useState(false)
  const contenedorRef = useRef(null)
  const botonRef = useRef(null)
  const panelId = useId()

  useEffect(() => {
    if (!abierto) return

    const handleClickAfuera = (evento) => {
      if (!contenedorRef.current?.contains(evento.target)) setAbierto(false)
    }
    const handleTecla = (evento) => {
      if (evento.key === 'Escape') {
        setAbierto(false)
        botonRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handleClickAfuera)
    document.addEventListener('keydown', handleTecla)
    return () => {
      document.removeEventListener('mousedown', handleClickAfuera)
      document.removeEventListener('keydown', handleTecla)
    }
  }, [abierto])

  const cerrar = () => setAbierto(false)

  const renderLinks = (links) =>
    links.map(({ to, texto, icono: Icono, end }) => (
      <li key={to}>
        <NavLink to={to} end={end} className={styles.link} onClick={cerrar}>
          <Icono size={18} aria-hidden="true" />
          {texto}
        </NavLink>
      </li>
    ))

  return (
    <div className={styles.menu} ref={contenedorRef}>
      <button
        ref={botonRef}
        type="button"
        className={styles.disparador}
        aria-expanded={abierto}
        aria-controls={panelId}
        onClick={() => setAbierto((valor) => !valor)}
      >
        <CircleUser size={22} aria-hidden="true" />
        <span className={styles.disparadorTexto}>Mi cuenta</span>
        <ChevronDown size={16} aria-hidden="true" className={styles.chevron} />
      </button>

      <div id={panelId} className={styles.panel} hidden={!abierto}>
        <div className={styles.ingreso}>
          <Link to={PATHS.login} className="boton boton-primario boton-bloque" onClick={cerrar}>
            Ingresar
          </Link>
          <p className={styles.registro}>
            ¿Primera vez?{' '}
            <Link to={PATHS.registro} onClick={cerrar}>
              Creá tu cuenta
            </Link>
          </p>
        </div>

        <ul className={styles.lista}>{renderLinks(LINKS_CUENTA)}</ul>

        <p className={styles.grupoTitulo} id={`${panelId}-admin`}>
          Administración
        </p>
        <ul className={styles.lista} aria-labelledby={`${panelId}-admin`}>
          {renderLinks(LINKS_ADMIN)}
        </ul>
      </div>
    </div>
  )
}
