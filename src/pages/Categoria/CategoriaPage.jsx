import { Hammer } from 'lucide-react'
import { useParams } from 'react-router'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'

/**
 * Productos de una categoría, ordenados por nombre.
 *
 * Endpoints:
 *   GET /api/categorias/{id}
 *   GET /api/productos?categoriaId={id}   (filtrar stock > 0)
 *
 * Componentes sugeridos: ProductoCard (compartido, en src/components), GrillaProductos.
 */
export default function CategoriaPage() {
  const { id } = useParams()

  return (
    <>
      <EncabezadoPagina
        titulo={`Categoría ${id}`}
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Categoría' }]}
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá van los productos disponibles de esta categoría."
      />
    </>
  )
}
