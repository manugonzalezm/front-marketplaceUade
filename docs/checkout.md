# Finalizar compra (checkout)

Paso entre "Mi compra" (`/compra`) y la compra confirmada (`/compra/confirmada`), en `/checkout`.

## Funciones

- Resumen de la compra de solo lectura: productos, cantidades, precio unitario, subtotal de cada uno y total.
- Elegir el medio de pago: Mercado Pago, tarjeta de crédito, tarjeta de débito, transferencia o efectivo al
  retirar. Si se confirma sin elegir, avisa y lleva el foco a las opciones.
- "Confirmar compra" simula `POST /api/carrito/checkout` y lleva a la compra confirmada.
- "Volver a mi compra" para cambiar cantidades o quitar productos.
- Compra confirmada: número de pedido de 8 dígitos, fecha, medio de pago, productos, total y "Volver al inicio".
- Estados de carga, error (con "Reintentar") y compra vacía. La compra confirmada sin pedido (entrando directo
  por URL) ofrece volver al inicio.

## Datos

Por ahora no le pegamos a la API: `src/api/checkoutSimulado.js` responde con JSON propios que tienen el formato
exacto de los DTO del back.

| Archivo                               | Simula                       | DTO                        |
| ------------------------------------- | ---------------------------- | -------------------------- |
| `public/data/checkout/carrito.json`   | `GET /api/carrito`           | `CarritoItemResponseDTO[]` |
| `public/data/checkout/respuesta.json` | `POST /api/carrito/checkout` | `CheckoutResponseDTO`      |

En cada confirmación la simulación genera un `pedidoId` nuevo de 8 dígitos y la fecha del momento; los ítems y el
total salen de `respuesta.json`. Si cambiás los productos de `carrito.json`, cambiá también los de
`respuesta.json` para que coincidan.

El medio de pago no existe en el back (el checkout no tiene body): la lista está en `src/pages/Checkout/mediosPago.js`
y el elegido viaja a la confirmación en el `state` junto con el pedido:

```js
navigate(PATHS.compraConfirmada, { replace: true, state: { pedido, medioPago: { id, nombre } } })
```

## Cómo probar

```bash
npm run dev
```

Ingresar con `jperez@uade.edu.ar` / `12345678` (los productos del resumen son de `lmartinez`) y abrir `/checkout`,
o usar el botón **Pantallas** → "Finalizar compra".

## Pasar a la API real

1. En `CheckoutPage.jsx`, cambiar el import `'@/api/checkoutSimulado'` por `'@/api/carrito'` (tiene las mismas
   funciones: `getCarrito` y `confirmarCompra`).
2. Borrar `src/api/checkoutSimulado.js` y `public/data/checkout/`.

## Integración pendiente

- "Mi compra" (`CompraPage`) tiene que linkear a `PATHS.checkout` con "Continuar compra".
- El back genera el `pedidoId` con autoincremental; la pantalla lo muestra siempre con 8 dígitos
  (`formatearNumeroPedido`: 12 → `00000012`).
