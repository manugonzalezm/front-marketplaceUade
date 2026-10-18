import { useParams } from 'react-router'

/**
 * Productos de una categoría, ordenados por nombre.
 *
 * Endpoints:
 *   GET /api/categorias/{id}
 *   GET /api/productos?categoriaId={id}   (filtrar stock > 0)
 */
export default function CategoriaPage() {
  const { id } = useParams()

  return (
    <section>
      <h1>Categoría {id}</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
