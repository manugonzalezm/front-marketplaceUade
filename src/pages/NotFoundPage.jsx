import { Link } from 'react-router'
import { PATHS } from '../routes/paths'

export default function NotFoundPage() {
  return (
    <section>
      <h1>No encontramos esta página</h1>
      <p className="texto-suave">Revisá la dirección o volvé al inicio para seguir buscando.</p>
      <Link to={PATHS.inicio} className="boton boton-primario">
        Ir al inicio
      </Link>
    </section>
  )
}
