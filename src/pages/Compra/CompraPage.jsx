import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'

/**
 * Compra en curso (el "carrito"). El usuario puede retomarla desde cualquier
 * parte de la app: cambiar cantidades, quitar productos o vaciarla.
 * Para seguir, un link a "Finalizar compra" (CheckoutPage), que muestra el
 * resumen, pide el medio de pago y hace el POST /api/carrito/checkout:
 *   <Link to={PATHS.checkout} className="boton boton-primario">Continuar compra</Link>
 *
 * Endpoints:
 *   GET    /api/carrito
 *   POST   /api/carrito                  { productoId, cantidad }
 *   DELETE /api/carrito/items/{itemId}
 *   DELETE /api/carrito
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
