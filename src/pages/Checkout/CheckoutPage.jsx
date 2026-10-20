import { CircleAlert, ShoppingBag } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { confirmarCompra, getCarrito } from '@/api/carrito'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'
import PanelTotal from './components/PanelTotal/PanelTotal'
import ResumenProductos from './components/ResumenProductos/ResumenProductos'
import SelectorMedioPago from './components/SelectorMedioPago/SelectorMedioPago'
import { MEDIOS_PAGO } from './mediosPago'
import styles from './CheckoutPage.module.css'

/**
 * Finalizar compra: paso entre "Mi compra" y la compra confirmada. Muestra la compra en curso de solo lectura
 * (productos, cantidades, subtotales y total), pide el medio de pago y confirma. Para cambiar algo, el usuario
 * vuelve a "Mi compra".
 *
 * Endpoints:
 *   GET  /api/carrito            -> [{ id, usuarioId, productoId, nombreProducto, precio, cantidad }]
 *   POST /api/carrito/checkout   -> { pedidoId, usuarioId, fecha, total, items }
 *
 * Al confirmar navega a la compra confirmada con el pedido en el state (el back no tiene GET de pedidos).
 */
export default function CheckoutPage() {
  const navigate = useNavigate()
  const selectorRef = useRef(null)
  const [carrito, setCarrito] = useState(null)
  const [error, setError] = useState(null)
  const [intento, setIntento] = useState(0)
  const [medioPagoId, setMedioPagoId] = useState(null)
  const [errorMedioPago, setErrorMedioPago] = useState(null)
  const [confirmando, setConfirmando] = useState(false)
  const [errorConfirmar, setErrorConfirmar] = useState(null)

  useEffect(() => {
    let cancelado = false // evita actualizar el estado si el usuario ya se fue de la página
    getCarrito()
      .then((datos) => {
        if (!cancelado) setCarrito(datos)
      })
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })
    return () => {
      cancelado = true
    }
  }, [intento])

  const handleReintentar = () => {
    setError(null)
    setIntento((anterior) => anterior + 1)
  }

  const handleSeleccionarMedio = (id) => {
    setMedioPagoId(id)
    setErrorMedioPago(null)
  }

  const handleConfirmar = async () => {
    if (!medioPagoId) {
      setErrorMedioPago('Elegí un medio de pago para confirmar la compra.')
      selectorRef.current?.querySelector('input')?.focus()
      return
    }

    setConfirmando(true)
    setErrorConfirmar(null)
    try {
      const pedido = await confirmarCompra()
      const { id, nombre } = MEDIOS_PAGO.find((medio) => medio.id === medioPagoId)
      // replace: con "atrás" desde la confirmación no se vuelve a este paso con la compra ya hecha.
      navigate(PATHS.compraConfirmada, { replace: true, state: { pedido, medioPago: { id, nombre } } })
    } catch (err) {
      setErrorConfirmar(err.message)
      setConfirmando(false)
    }
  }

  const encabezado = (
    <EncabezadoPagina
      titulo="Finalizar compra"
      descripcion="Revisá los productos y elegí cómo pagar. Si querés cambiar algo, volvé a tu compra."
      migas={[{ texto: 'Mi compra', to: PATHS.compra }, { texto: 'Finalizar compra' }]}
    />
  )

  if (error) {
    return (
      <>
        {encabezado}
        <EstadoVacio icono={CircleAlert} titulo="No pudimos cargar tu compra" descripcion={error}>
          <button type="button" className="boton boton-primario" onClick={handleReintentar}>
            Reintentar
          </button>
          <Link to={PATHS.compra} className="boton boton-secundario">
            Volver a mi compra
          </Link>
        </EstadoVacio>
      </>
    )
  }

  if (!carrito) {
    return (
      <>
        {encabezado}
        <p className="texto-suave">Cargando tu compra…</p>
      </>
    )
  }

  if (carrito.length === 0) {
    return (
      <>
        {encabezado}
        <EstadoVacio
          icono={ShoppingBag}
          titulo="Tu compra está vacía"
          descripcion="Agregá productos a tu compra para poder finalizarla."
        >
          <Link to={PATHS.inicio} className="boton boton-primario">
            Ver productos
          </Link>
        </EstadoVacio>
      </>
    )
  }

  // GET /api/carrito trae `precio`; la lista usa el formato de los ítems del pedido (`precioUnitario`).
  const items = carrito.map(({ productoId, nombreProducto, cantidad, precio }) => ({
    productoId,
    nombreProducto,
    cantidad,
    precioUnitario: precio,
  }))
  const unidades = items.reduce((suma, item) => suma + item.cantidad, 0)
  const total = items.reduce((suma, item) => suma + item.cantidad * item.precioUnitario, 0)

  return (
    <>
      {encabezado}

      {errorConfirmar && (
        <p role="alert" className={styles.error}>
          {errorConfirmar}
        </p>
      )}

      <div className={styles.contenido}>
        <div className={styles.columnaPrincipal}>
          <ResumenProductos items={items} />
          <SelectorMedioPago
            ref={selectorRef}
            medios={MEDIOS_PAGO}
            seleccionado={medioPagoId}
            error={errorMedioPago}
            deshabilitado={confirmando}
            onSeleccionar={handleSeleccionarMedio}
          />
        </div>
        <PanelTotal
          unidades={unidades}
          total={total}
          confirmando={confirmando}
          onConfirmar={handleConfirmar}
        />
      </div>
    </>
  )
}
