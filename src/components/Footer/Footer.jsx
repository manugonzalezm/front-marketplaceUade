import { Link } from 'react-router'
import Logo from '@/components/Logo/Logo'
import { PATHS } from '@/routes/paths'
import styles from './Footer.module.css'

const ANIO = new Date().getFullYear()

const COLUMNAS = [
  {
    titulo: 'Comprar',
    links: [
      { to: PATHS.inicio, texto: 'Ver productos' },
      { to: PATHS.compra, texto: 'Mi compra' },
    ],
  },
  {
    titulo: 'Vender',
    links: [
      { to: PATHS.productoNuevo, texto: 'Publicar producto' },
      { to: PATHS.misProductos, texto: 'Mis productos' },
    ],
  },
  {
    titulo: 'Mi cuenta',
    links: [
      { to: PATHS.login, texto: 'Ingresar' },
      { to: PATHS.registro, texto: 'Crear cuenta' },
      { to: PATHS.perfil, texto: 'Mi perfil' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`contenedor ${styles.contenido}`}>
        <div className={styles.marca}>
          <Logo />
          <p className={styles.descripcion}>
            Comprá y vendé productos usados entre estudiantes de UADE: libros, apuntes, tecnología y todo lo
            que ya no usás.
          </p>
        </div>

        <nav aria-label="Pie de página" className={styles.columnas}>
          {COLUMNAS.map((columna) => (
            <div key={columna.titulo}>
              <h2 className={styles.titulo}>{columna.titulo}</h2>
              <ul className={styles.lista}>
                {columna.links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className={styles.link}>
                      {link.texto}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className={styles.legal}>
        <div className="contenedor">
          <p>Proyecto universitario de Aplicaciones Interactivas, UADE {ANIO}.</p>
        </div>
      </div>
    </footer>
  )
}
