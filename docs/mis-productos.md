# Mis productos

Pantalla del vendedor disponible en `/mis-productos`.

## Funciones

- Listar los productos propios con foto, nombre, precio y stock.
- Mostrar los productos sin stock como pausados.
- Acceder al formulario para publicar o editar.
- Eliminar productos y fotos con confirmación.
- Mostrar estados de carga, error y listado vacío.

## Datos de prueba

Los datos se leen desde `public/demo-mis-productos/` mediante `src/api/misProductosDemo.js`.
Se usa el vendedor de prueba con id 1. Las eliminaciones se mantienen en memoria y se reinician al recargar.
Las imágenes son ilustraciones de ejemplo.

## Cómo probar

```bash
npm run dev
```

Abrir `/mis-productos`. El listado inicial contiene cuatro publicaciones propias, una sin stock.
Se puede eliminar una foto o un producto, cancelar la confirmación y recargar para recuperar los datos.

Para ejecutar las pruebas del servicio:

```bash
node --test src/api/misProductosDemo.test.js
```

## Integración pendiente

- Reemplazar los datos temporales por los JSON compartidos.
- Usar el usuario de la sesión en lugar del vendedor de prueba.
- Compartir el estado con el formulario de publicar y editar para reflejar los cambios entre pantallas.
- Completar el mockup y las transiciones en el Figma del grupo.

Los enlaces de publicar y editar apuntan a las rutas del formulario, todavía pendiente en esta versión.
La Navbar conserva su consulta a `/api/categorias`; se debe adaptar para ejecutar toda la app con JSON.
