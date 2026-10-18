/**
 * Resumen de la compra confirmada: número de pedido, fecha, productos y total.
 * El back no tiene un GET de pedidos: los datos llegan desde CompraPage en
 * location.state.pedido. Si se entra directo (sin state), ofrecer volver al inicio.
 */
export default function CompraConfirmadaPage() {
  return (
    <section>
      <h1>Compra confirmada</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
