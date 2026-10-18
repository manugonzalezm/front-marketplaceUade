import { useParams } from 'react-router'

/**
 * Detalle de producto: imagen ampliada, descripción, precio y stock.
 * Desde acá se agrega el producto a la compra en curso. Sin stock: mostrarlo y
 * no permitir agregarlo.
 *
 * Endpoints:
 *   GET  /api/productos/{id}
 *   GET  /api/productos/{id}/imagenes   (cada imagen trae su url para el <img>)
 *   POST /api/carrito                    { productoId, cantidad }
 */
export default function ProductoDetallePage() {
  const { id } = useParams()

  return (
    <section>
      <h1>Detalle del producto {id}</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
