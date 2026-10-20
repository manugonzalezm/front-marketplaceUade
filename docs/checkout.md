# Finalizar compra (checkout)

Paso entre "Mi compra" (`/compra`) y la compra confirmada (`/compra/confirmada`), en `/checkout`.

## Funciones

- Resumen de la compra de solo lectura: productos, cantidades, precio unitario, subtotal de cada uno y total.
- Elegir el medio de pago: Mercado Pago, tarjeta de crédito, tarjeta de débito, transferencia o efectivo al
  retirar. Si se confirma sin elegir, avisa y lleva el foco a las opciones.
- "Confirmar compra" hace `POST /api/carrito/checkout` y lleva a la compra confirmada.
- "Volver a mi compra" para cambiar cantidades o quitar productos.
- Compra confirmada: número de pedido de 8 dígitos, fecha, medio de pago, productos, total y "Volver al inicio".
- Estados de carga, error (con "Reintentar") y compra vacía. La compra confirmada sin pedido (entrando directo
  por URL) ofrece volver al inicio.

## Datos

Usa las funciones compartidas de `src/api/carrito.js`: `getCarrito` y `confirmarCompra`. En desarrollo responde
el mock de `public/data/` con el mismo carrito de "Mi compra"; para usar el back, `VITE_USAR_MOCKS=false`.

El medio de pago no existe en el back (el checkout no tiene body): la lista está en
`src/pages/Checkout/mediosPago.js` y el elegido viaja a la confirmación en el `state` junto con el pedido:

```js
navigate(PATHS.compraConfirmada, { replace: true, state: { pedido, medioPago: { id, nombre } } })
```

## Cómo probar

```bash
npm run dev
```

Ingresar con `jperez@uade.edu.ar` / `12345678` (los productos del resumen son de `lmartinez`) y abrir `/checkout`,
o usar el botón **Pantallas** → "Finalizar compra".

## Integración

- "Mi compra" linkea a `PATHS.checkout` con "Ir al checkout".
- Al confirmar, el carrito queda vacío y el badge del header se actualiza.
- El back genera el `pedidoId` con autoincremental; la pantalla lo muestra siempre con 8 dígitos
  (`formatearNumeroPedido`: 12 → `00000012`).
