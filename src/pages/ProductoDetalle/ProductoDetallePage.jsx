import { Hammer } from 'lucide-react'
import { useParams } from 'react-router'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'

/**
 * Detalle de producto: imagen ampliada, descripción, precio y stock.
 * Desde acá se agrega el producto a la compra en curso. Sin stock: mostrarlo y
 * no permitir agregarlo.
 *
 * Endpoints:
 *   GET  /api/productos/{id}
 *   GET  /api/productos/{id}/imagenes   (cada imagen trae su url para el <img>)
 *   GET  /api/categorias/{categoriaId}  (para mostrar el nombre de la categoría)
 *   POST /api/carrito                    { productoId, cantidad }
 *
 * Componentes sugeridos: GaleriaImagenes, InfoProducto, PanelCompra.
 */
export default function ProductoDetallePage() {
  const { id } = useParams()

  return (
    <>
      <EncabezadoPagina
        titulo={`Producto ${id}`}
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Detalle del producto' }]}
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá van las fotos del producto, su descripción, el precio, el stock y el botón para agregarlo a tu compra."
      />
    </>
  )
}
