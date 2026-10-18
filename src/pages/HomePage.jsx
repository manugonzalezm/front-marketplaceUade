/**
 * Inicio: dos secciones, productos ordenados alfabéticamente y categorías del sitio.
 * Cada producto linkea a su detalle y cada categoría a sus productos.
 *
 * Endpoints:
 *   GET /api/productos    (ya viene ordenado por nombre; filtrar stock > 0)
 *   GET /api/categorias
 */
export default function HomePage() {
  return (
    <section>
      <h1>Inicio</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
