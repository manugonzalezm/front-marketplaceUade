import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'

/**
 * Datos del usuario logueado, edición y baja de la cuenta.
 * Al editar, la contraseña es opcional: si no se manda, el back conserva la actual.
 *
 * Endpoints:
 *   GET    /api/usuarios/{id}
 *   PUT    /api/usuarios/{id}   (mismo body que el registro)
 *   DELETE /api/usuarios/{id}
 *
 * Componentes sugeridos: FormularioPerfil, EliminarCuenta.
 */
export default function PerfilPage() {
  return (
    <>
      <EncabezadoPagina titulo="Mi perfil" descripcion="Tus datos personales y de acceso." />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá van tus datos para editarlos y la opción de eliminar la cuenta."
      />
    </>
  )
}
