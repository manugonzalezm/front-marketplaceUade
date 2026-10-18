import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'

/**
 * Listado de usuarios del sitio (solo rol ADMIN), con opción de eliminar.
 *
 * Endpoints:
 *   GET    /api/usuarios
 *   DELETE /api/usuarios/{id}
 *
 * Componentes sugeridos: TablaUsuarios.
 */
export default function AdminUsuariosPage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Usuarios"
        descripcion="Todas las cuentas registradas en el sitio."
        migas={[{ texto: 'Administración' }, { texto: 'Usuarios' }]}
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá va el listado de usuarios con sus datos y la opción de eliminar cuentas."
      />
    </>
  )
}
