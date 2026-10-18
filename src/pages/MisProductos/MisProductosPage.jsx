import { Hammer, Plus } from 'lucide-react'
import { Link } from 'react-router'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'

/**
 * Productos publicados por el usuario logueado, con acceso a editarlos
 * (incluye manejar el stock) y a eliminarlos. Acá sí se muestran los que
 * tienen stock 0, marcados como pausados.
 *
 * Endpoints:
 *   GET    /api/productos?usuarioId={idDelUsuarioLogueado}
 *   DELETE /api/productos/{id}
 *
 * Componentes sugeridos: TablaMisProductos (o ProductoCard con acciones), ConfirmarEliminacion.
 */
export default function MisProductosPage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Mis productos"
        descripcion="Lo que publicaste para vender. Desde acá editás el stock o das de baja un producto."
        acciones={
          <Link to={PATHS.productoNuevo} className="boton boton-primario">
            <Plus size={18} aria-hidden="true" />
            Publicar producto
          </Link>
        }
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá va el listado de tus productos con su precio, stock y las opciones para editarlos o eliminarlos."
      />
    </>
  )
}
