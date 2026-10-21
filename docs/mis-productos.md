# Mis productos

Pantalla del vendedor disponible en `/mis-productos`.

## Funciones

- Listar los productos propios con foto, nombre, precio y stock.
- Mostrar los productos sin stock como pausados.
- Acceder al formulario para publicar o editar.
- Eliminar productos y fotos con confirmación.
- Mostrar estados de carga, error y listado vacío.

## Datos

Usa las funciones compartidas de `src/api/productos.js` y el usuario de la sesión (`useAuth`).
En modo mock los datos salen de `public/data/` (productos, imágenes por producto) mediante `src/api/mock.js`;
las eliminaciones se mantienen en memoria y se reinician al recargar.

## Cómo probar

```bash
npm run dev
```

Ingresar con `jperez@uade.edu.ar` / `12345678` y abrir `/mis-productos`. El listado contiene seis
publicaciones propias, dos sin stock y una sin fotos. Se puede eliminar una foto o un producto, cancelar la
confirmación y recargar para recuperar los datos.

## Integración pendiente

- Compartir el estado con el formulario de publicar y editar para reflejar los cambios entre pantallas.
- Completar el mockup y las transiciones en el Figma del grupo.
