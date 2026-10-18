import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'

/**
 * Inicio: dos secciones, productos ordenados alfabéticamente y categorías del sitio.
 * Cada producto linkea a su detalle y cada categoría a sus productos.
 * Si la URL trae ?q=texto (buscador del header), filtrar los productos por nombre:
 * el back no tiene endpoint de búsqueda.
 *
 * Endpoints:
 *   GET /api/productos    (ya viene ordenado por nombre; filtrar stock > 0)
 *   GET /api/categorias
 *
 * Componentes sugeridos: ProductoCard (compartido, en src/components), GrillaProductos,
 * ListaCategorias.
 */
export default function HomePage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Productos publicados"
        descripcion="Encontrá lo que necesitás entre lo que venden otros estudiantes."
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá van los productos disponibles ordenados por nombre y las categorías del sitio."
      />
    </>
  )
}
