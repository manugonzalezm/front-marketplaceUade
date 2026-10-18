import { SearchX } from 'lucide-react'
import { Link } from 'react-router'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'

export default function NotFoundPage() {
  return (
    <>
      <h1 className="solo-lectores">Página no encontrada</h1>
      <EstadoVacio
        icono={SearchX}
        titulo="No encontramos esta página"
        descripcion="Puede que el link esté mal escrito o que el producto ya no esté publicado."
      >
        <Link to={PATHS.inicio} className="boton boton-primario">
          Ir al inicio
        </Link>
      </EstadoVacio>
    </>
  )
}
