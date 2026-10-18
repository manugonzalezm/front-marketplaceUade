/**
 * Compra en curso (el "carrito"). El usuario puede retomarla desde cualquier
 * parte de la app: cambiar cantidades, quitar productos, vaciarla o confirmarla.
 * Al confirmar, navegar a la confirmación pasando la respuesta del checkout:
 *   navigate(PATHS.compraConfirmada, { state: { pedido } })
 *
 * Endpoints:
 *   GET    /api/carrito
 *   POST   /api/carrito                  { productoId, cantidad }
 *   DELETE /api/carrito/items/{itemId}
 *   DELETE /api/carrito
 *   POST   /api/carrito/checkout         -> { pedidoId, fecha, total, items }
 */
export default function CompraPage() {
  return (
    <section>
      <h1>Mi compra</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
