import { Banknote, CreditCard, Landmark, Wallet, WalletCards } from 'lucide-react'

// Medios de pago que se eligen al finalizar la compra. El back todavía no los recibe (POST /api/carrito/checkout
// no tiene body), así que por ahora el elegido solo viaja a la pantalla de compra confirmada.
// Los id van en mayúsculas, como los enums del back, por si después se agrega el campo.
export const MEDIOS_PAGO = [
  {
    id: 'MERCADO_PAGO',
    nombre: 'Mercado Pago',
    descripcion: 'Con dinero en cuenta o tus tarjetas guardadas.',
    icono: Wallet,
  },
  {
    id: 'TARJETA_CREDITO',
    nombre: 'Tarjeta de crédito',
    descripcion: 'Visa, Mastercard o American Express.',
    icono: CreditCard,
  },
  {
    id: 'TARJETA_DEBITO',
    nombre: 'Tarjeta de débito',
    descripcion: 'Se descuenta de tu cuenta en el momento.',
    icono: WalletCards,
  },
  {
    id: 'TRANSFERENCIA',
    nombre: 'Transferencia bancaria',
    descripcion: 'Al CBU o alias que te pase el vendedor.',
    icono: Landmark,
  },
  {
    id: 'EFECTIVO',
    nombre: 'Efectivo al retirar',
    descripcion: 'Le pagás al vendedor cuando retirás los productos.',
    icono: Banknote,
  },
]
