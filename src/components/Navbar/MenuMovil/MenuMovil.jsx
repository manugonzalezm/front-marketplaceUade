import { House, LogOut, Menu, X } from 'lucide-react'
import { useRef } from 'react'
import { generatePath, Link, NavLink, useNavigate } from 'react-router'
import Logo from '@/components/Logo/Logo'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import { LINKS_ADMIN, LINKS_CUENTA } from '../links'
import styles from './MenuMovil.module.css'

const LINK_INICIO = { to: PATHS.inicio, texto: 'Inicio', icono: House, end: true }

const claseLink = ({ isActive }) => (isActive ? `${styles.link} ${styles.linkActivo}` : styles.link)

/**
 * Botón de menú + panel lateral para celular. Usa <dialog> nativo: el navegador
 * resuelve el foco, el Escape y que no se pueda tocar lo de atrás. Los links de
 * la cuenta y de administración dependen de la sesión (ver useAuth).
 *
 * @param {{ categorias: Array<{ id: number, nombre: string }> }} props
 */
export default function MenuMovil({ categorias }) {
  const { usuario, estaLogueado, esAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const dialogRef = useRef(null)
  const linksPrincipales = estaLogueado ? [LINK_INICIO, ...LINKS_CUENTA] : [LINK_INICIO]

  const abrir = () => dialogRef.current?.showModal()
  const cerrar = () => dialogRef.current?.close()

  const handleCerrarSesion = () => {
    cerrar()
    logout()
    navigate(PATHS.inicio)
  }

  // Clic en el fondo oscuro (fuera del panel) cierra el menú
  const handleClickDialog = (evento) => {
    if (evento.target === dialogRef.current) cerrar()
  }

  return (
    <>
      <button type="button" className={styles.abrir} onClick={abrir}>
        <Menu size={24} aria-hidden="true" />
        <span className="solo-lectores">Abrir menú</span>
      </button>

      <dialog ref={dialogRef} className={styles.dialog} aria-label="Menú" onClick={handleClickDialog}>
        <div className={styles.panel}>
          <div className={styles.encabezado}>
            <Logo />
            <button type="button" className={styles.cerrar} onClick={cerrar}>
              <X size={22} aria-hidden="true" />
              <span className="solo-lectores">Cerrar menú</span>
            </button>
          </div>

          {estaLogueado ? (
            <div className={styles.usuario}>
              <p className={styles.usuarioNombre}>
                {usuario.nombre} {usuario.apellido}
              </p>
              <p className={styles.usuarioMail}>{usuario.mail}</p>
            </div>
          ) : (
            <div className={styles.ingreso}>
              <Link to={PATHS.login} className="boton boton-primario" onClick={cerrar}>
                Ingresar
              </Link>
              <Link to={PATHS.registro} className="boton boton-secundario" onClick={cerrar}>
                Crear cuenta
              </Link>
            </div>
          )}

          <nav aria-label="Menú principal" className={styles.secciones}>
            <ul className={styles.lista}>
              {linksPrincipales.map(({ to, texto, icono: Icono, end }) => (
                <li key={to}>
                  <NavLink to={to} end={end} className={claseLink} onClick={cerrar}>
                    <Icono size={20} aria-hidden="true" />
                    {texto}
                  </NavLink>
                </li>
              ))}
            </ul>

            {categorias.length > 0 && (
              <section>
                <h2 className={styles.grupoTitulo}>Categorías</h2>
                <ul className={styles.lista}>
                  {categorias.map((categoria) => (
                    <li key={categoria.id}>
                      <NavLink
                        to={generatePath(PATHS.categoria, { id: categoria.id })}
                        className={claseLink}
                        onClick={cerrar}
                      >
                        {categoria.nombre}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {esAdmin && (
              <section>
                <h2 className={styles.grupoTitulo}>Administración</h2>
                <ul className={styles.lista}>
                  {LINKS_ADMIN.map(({ to, texto, icono: Icono }) => (
                    <li key={to}>
                      <NavLink to={to} className={claseLink} onClick={cerrar}>
                        <Icono size={20} aria-hidden="true" />
                        {texto}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {estaLogueado && (
              <button type="button" className={`${styles.link} ${styles.salir}`} onClick={handleCerrarSesion}>
                <LogOut size={20} aria-hidden="true" />
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </dialog>
    </>
  )
}
