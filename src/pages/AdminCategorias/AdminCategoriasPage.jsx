import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'

/**
 * Administración de categorías (solo rol ADMIN): listar, crear, renombrar y eliminar.
 *
 * Endpoints:
 *   GET    /api/categorias
 *   POST   /api/categorias        { nombre }   (409 si el nombre ya existe)
 *   PUT    /api/categorias/{id}   { nombre }
 *   DELETE /api/categorias/{id}   (409 si tiene productos asociados)
 *
 * Componentes sugeridos: TablaCategorias, FormularioCategoria.
 */
export default function AdminCategoriasPage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Categorías"
        descripcion="Las categorías en las que se pueden publicar productos."
        migas={[{ texto: 'Administración' }, { texto: 'Categorías' }]}
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá va el listado de categorías con las opciones para crear, renombrar y eliminar."
      />
    </>
  )
}
