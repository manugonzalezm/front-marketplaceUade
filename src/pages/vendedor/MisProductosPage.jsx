/**
 * Productos publicados por el usuario logueado, con acceso a editarlos
 * (incluye manejar el stock) y a eliminarlos. Acá sí se muestran los que
 * tienen stock 0 (pausados).
 *
 * Endpoints:
 *   GET    /api/productos?usuarioId={idDelUsuarioLogueado}
 *   DELETE /api/productos/{id}
 */
export default function MisProductosPage() {
  return (
    <section>
      <h1>Mis productos</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
