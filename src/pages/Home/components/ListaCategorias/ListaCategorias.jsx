import { ArrowUpRight } from 'lucide-react'
import { generatePath, Link } from 'react-router'
import { PATHS } from '@/routes/paths'
import styles from './ListaCategorias.module.css'

/** Lista completa: cada enlace abre el filtro existente, con su opción de volver a ver todos.
 * @param {{ categorias: Array<{ id: number, nombre: string }> }} props
 */
export default function ListaCategorias({ categorias }) {
  if (categorias.length === 0) return <p className="texto-suave">Todavía no hay categorías disponibles.</p>

  return (
    <ul className={styles.lista}>
      {categorias.map((categoria) => (
        <li key={categoria.id}>
          <Link to={generatePath(PATHS.categoria, { id: categoria.id })} className={styles.categoria}>
            <span>{categoria.nombre}</span>
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
