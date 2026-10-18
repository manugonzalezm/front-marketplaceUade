import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'

/**
 * Login con mail y contraseña. Guarda el token y el usuario que devuelve el back
 * (ver AuthContext en AGENTS.md) y redirige a la página desde la que vino
 * (location.state?.desde) o al inicio.
 *
 * Endpoints:
 *   POST /api/usuarios/login   { mail, contrasena } -> { usuario, token }
 *
 * Componentes sugeridos: FormularioLogin.
 */
export default function LoginPage() {
  return (
    <>
      <EncabezadoPagina titulo="Ingresar" descripcion="Usá el mail y la contraseña de tu cuenta." />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá va el formulario de ingreso con mail y contraseña."
      />
    </>
  )
}
