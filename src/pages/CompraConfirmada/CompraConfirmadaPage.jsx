import { House, ReceiptText } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'
import DetallePedido from './components/DetallePedido/DetallePedido'
import styles from './CompraConfirmadaPage.module.css'

/**
 * Compra realizada: número de pedido, fecha, medio de pago, productos y total, y botón para volver al inicio.
 * El back no tiene un GET de pedidos: los datos llegan desde CheckoutPage en location.state
 * ({ pedido, medioPago }). Si se entra directo (sin state), ofrece volver al inicio.
 */
export default function CompraConfirmadaPage() {
  const { state } = useLocation()
  const pedido = state?.pedido

  if (!pedido) {
    return (
      <>
        <EncabezadoPagina titulo="Compra confirmada" />
        <EstadoVacio
          icono={ReceiptText}
          titulo="No hay un pedido para mostrar"
          descripcion="El detalle del pedido aparece acá justo después de confirmar una compra."
        >
          <Link to={PATHS.inicio} className="boton boton-primario">
            Volver al inicio
          </Link>
        </EstadoVacio>
      </>
    )
  }

  return (
    <>
      <EncabezadoPagina
        titulo="¡Gracias por tu compra!"
        descripcion="Tu pedido quedó confirmado. Guardá el número por si necesitás consultarlo."
      />
      <div className={styles.contenido}>
        <DetallePedido pedido={pedido} medioPago={state.medioPago} />
        <Link to={PATHS.inicio} className={`boton boton-primario ${styles.volver}`}>
          <House size={18} aria-hidden="true" />
          Volver al inicio
        </Link>
      </div>
    </>
  )
}
