import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import styles from './EncabezadoPagina.module.css'

/**
 * Encabezado estándar de página: migas de pan opcionales, título (el único <h1>
 * de la pantalla), descripción y acciones a la derecha. Usarlo en todas las
 * pantallas para que se vean iguales.
 *
 * @param {object} props
 * @param {string} props.titulo
 * @param {string} [props.descripcion]
 * @param {Array<{ texto: string, to?: string }>} [props.migas]  El último item es la página actual (sin `to`).
 * @param {import('react').ReactNode} [props.acciones]  Botones o links, por ejemplo "Publicar producto".
 */
export default function EncabezadoPagina({ titulo, descripcion, migas, acciones }) {
  return (
    <header className={styles.encabezado}>
      {migas?.length > 0 && (
        <nav aria-label="Ruta de navegación">
          <ol className={styles.migas}>
            {migas.map((miga, indice) => {
              const esUltima = indice === migas.length - 1
              return (
                <li key={miga.texto} className={styles.miga}>
                  {miga.to && !esUltima ? (
                    <Link to={miga.to}>{miga.texto}</Link>
                  ) : (
                    <span aria-current={esUltima ? 'page' : undefined}>{miga.texto}</span>
                  )}
                  {!esUltima && <ChevronRight size={14} aria-hidden="true" className={styles.separador} />}
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      <div className={styles.fila}>
        <div className={styles.textos}>
          <h1 className={styles.titulo}>{titulo}</h1>
          {descripcion && <p className={styles.descripcion}>{descripcion}</p>}
        </div>
        {acciones && <div className={styles.acciones}>{acciones}</div>}
      </div>
    </header>
  )
}
