# Productos de una categoría

Pantalla pública en `/categorias/:id` (`PATHS.categoria`). Se llega desde la barra de categorías del header.

## Funciones

- Lista los productos de la categoría que el usuario puede comprar, ordenados por nombre: solo con stock y sin los
  que publicó el usuario logueado. Sin sesión se ven todos los que tienen stock.
- Cada producto es un `ProductoCard` (`src/components/ProductoCard/`): foto, nombre, precio y stock ("Última
  unidad" si queda una). Toda la tarjeta lleva al detalle del producto.
- Grilla de 2 columnas en celular, 3 en tablet y 4 en escritorio.
- Estados de carga, error (con "Reintentar"), categoría vacía y categoría que no existe (`/categorias/99` o
  `/categorias/abc`).

## Datos

Usa las funciones compartidas de `src/api/`; en modo mock responden desde `public/data/`:

- `GET /api/categorias/{id}` para el nombre.
- `GET /api/productos?categoriaId={id}`: el back trae también los de stock 0 y los propios, así que se filtran en la
  vista.
- `GET /api/productos/{id}/imagenes`, uno por producto, para la primera foto. Si falla, la tarjeta se muestra sin
  foto.

## Cómo probar

Con `npm run dev`, abrir "Electrónica" en la barra de categorías:

- Sin sesión: Auriculares, Calculadora, Monitor y Notebook.
- Con `jperez@uade.edu.ar` / `12345678`: solo Auriculares y Notebook (la Calculadora y el Monitor son de jperez).
- "Deportes" muestra la categoría vacía (su único producto no tiene stock).

## Para reusar

`ProductoCard` está pensado también para el inicio. Recibe `producto`, `imagen` (o `null`) y `nivelTitulo`
(`3` si va debajo de un `<h2>` de sección).
