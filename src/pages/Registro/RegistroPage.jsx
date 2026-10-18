import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'

/**
 * Registro de usuario. El back no devuelve token al registrarse: después del alta
 * hay que hacer login (automático o mandando al usuario a /login).
 *
 * Endpoints:
 *   POST /api/usuarios/registro
 *     { nombreUsuario, mail, contrasena, nombre, apellido,
 *       fechaNacimiento: 'AAAA-MM-DD', sexo: 'MASCULINO' | 'FEMENINO' | 'OTRO' }
 *
 * Componentes sugeridos: FormularioRegistro.
 */
export default function RegistroPage() {
  return (
    <>
      <EncabezadoPagina titulo="Crear cuenta" descripcion="Registrate para comprar y publicar productos." />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá va el formulario de registro con tus datos personales y de acceso."
      />
    </>
  )
}
