import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'

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
 *
 * Componentes sugeridos: ItemCompra, ResumenCompra.
 */
export default function CompraPage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Mi compra"
        descripcion="Revisá los productos que elegiste antes de confirmar la compra."
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá van los productos de tu compra en curso, el total y el botón para confirmarla."
      />
    </>
  )
}
