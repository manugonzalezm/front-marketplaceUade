import { Compass } from 'lucide-react'
import { useRef } from 'react'
import { generatePath, NavLink } from 'react-router'
import { PATHS } from '@/routes/paths'
import styles from './MapaPantallas.module.css'

// Herramienta de desarrollo: acceso directo a todas las pantallas, incluidas las
// que en la app se abren desde otra página (detalle, edición, confirmación).
// MainLayout la muestra con `npm run dev` o con VITE_MOSTRAR_PANTALLAS=true.
// Las rutas con :id usan el id 1.
const GRUPOS = [
  {
    titulo: 'Públicas',
    links: [
      { to: PATHS.inicio, texto: 'Inicio' },
      { to: PATHS.login, texto: 'Ingresar' },
      { to: PATHS.registro, texto: 'Crear cuenta' },
      { to: generatePath(PATHS.productoDetalle, { id: 1 }), texto: 'Detalle de producto' },
      { to: generatePath(PATHS.categoria, { id: 1 }), texto: 'Categoría' },
    ],
  },
  {
    titulo: 'Con sesión',
    links: [
      { to: PATHS.compra, texto: 'Mi compra' },
      { to: PATHS.checkout, texto: 'Checkout' },
      { to: PATHS.compraConfirmada, texto: 'Compra confirmada' },
      { to: PATHS.misProductos, texto: 'Mis productos' },
      { to: PATHS.productoNuevo, texto: 'Publicar producto' },
      { to: generatePath(PATHS.productoEditar, { id: 1 }), texto: 'Editar producto' },
      { to: PATHS.perfil, texto: 'Mi perfil' },
    ],
  },
  {
    titulo: 'Administración',
    links: [
      { to: PATHS.adminCategorias, texto: 'Categorías' },
      { to: PATHS.adminUsuarios, texto: 'Usuarios' },
      { to: '/esta-ruta-no-existe', texto: 'Página no encontrada' },
    ],
  },
]

export default function MapaPantallas() {
  const detailsRef = useRef(null)
  const cerrar = () => detailsRef.current?.removeAttribute('open')

  return (
    <details ref={detailsRef} className={styles.mapa}>
      <summary className={styles.disparador}>
        <Compass size={18} aria-hidden="true" />
        Pantallas
      </summary>

      <div className={styles.panel}>
        <p className={styles.aviso}>Atajos para el equipo. No se muestran en la versión final.</p>
        {GRUPOS.map((grupo) => (
          <div key={grupo.titulo} className={styles.grupo}>
            <p className={styles.grupoTitulo}>{grupo.titulo}</p>
            <ul className={styles.lista}>
              {grupo.links.map((link) => (
                <li key={link.to}>
                  <NavLink to={link.to} end className={styles.link} onClick={cerrar}>
                    <span className={styles.texto}>{link.texto}</span>
                    <code className={styles.ruta}>{link.to}</code>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  )
}
