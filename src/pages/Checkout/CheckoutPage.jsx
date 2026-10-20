import { Hammer } from 'lucide-react'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'

export default function CheckoutPage() {
  return (
    <>
      <EncabezadoPagina
        titulo="Checkout"
        descripcion="Confirmá los datos y la entrega de tu compra."
        migas={[{ texto: 'Mi compra', to: PATHS.compra }, { texto: 'Checkout' }]}
      />
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá vas a poder confirmar la compra y elegir cómo recibir tus productos."
      />
    </>
  )
}
