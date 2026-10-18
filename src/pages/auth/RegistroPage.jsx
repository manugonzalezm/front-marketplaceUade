/**
 * Registro de usuario. El back no devuelve token al registrarse: después del alta
 * hay que hacer login (automático o mandando al usuario a /login).
 *
 * Endpoints:
 *   POST /api/usuarios/registro
 *     { nombreUsuario, mail, contrasena, nombre, apellido,
 *       fechaNacimiento: 'AAAA-MM-DD', sexo: 'MASCULINO' | 'FEMENINO' | 'OTRO' }
 */
export default function RegistroPage() {
  return (
    <section>
      <h1>Crear cuenta</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
