/**
 * Datos del usuario logueado, edición y baja de la cuenta.
 * Al editar, la contraseña es opcional: si no se manda, el back conserva la actual.
 *
 * Endpoints:
 *   GET    /api/usuarios/{id}
 *   PUT    /api/usuarios/{id}   (mismo body que el registro)
 *   DELETE /api/usuarios/{id}
 */
export default function PerfilPage() {
  return (
    <section>
      <h1>Mi perfil</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
