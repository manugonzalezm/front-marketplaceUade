import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'

/**
 * Resumen de la compra confirmada: número de pedido, fecha, productos y total.
 * El back no tiene un GET de pedidos: los datos llegan desde CompraPage en
 * location.state.pedido. Si se entra directo (sin state), ofrecer volver al inicio.
 *
 * Componentes sugeridos: ResumenPedido.
 */
export default function CompraConfirmadaPage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Compra confirmada"
        migas={[{ texto: 'Mi compra', to: PATHS.compra }, { texto: 'Confirmación' }]}
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá va el resumen del pedido: número, fecha, productos comprados y total."
      />
    </>
  )
}
