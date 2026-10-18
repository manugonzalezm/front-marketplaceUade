/**
 * Login con mail y contraseña. Guarda el token y el usuario que devuelve el back
 * y redirige a la página desde la que vino (location.state?.desde) o al inicio.
 *
 * Endpoints:
 *   POST /api/usuarios/login   { mail, contrasena } -> { usuario, token }
 */
export default function LoginPage() {
  return (
    <section>
      <h1>Ingresar</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
