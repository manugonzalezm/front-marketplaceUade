/**
 * Administración de categorías (solo rol ADMIN): listar, crear, renombrar y eliminar.
 *
 * Endpoints:
 *   GET    /api/categorias
 *   POST   /api/categorias        { nombre }   (409 si el nombre ya existe)
 *   PUT    /api/categorias/{id}   { nombre }
 *   DELETE /api/categorias/{id}   (409 si tiene productos asociados)
 */
export default function AdminCategoriasPage() {
  return (
    <section>
      <h1>Categorías</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
