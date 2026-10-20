# Punto 7: Mis productos

Implementado en la rama `feature/mis-productos`, en la ruta `/mis-productos`.

## Qué se puede probar

- Listado alfabético del vendedor de prueba, con foto, nombre, precio y stock.
- Productos sin stock visibles como pausados; productos ajenos excluidos.
- Editar y publicar navegan a las rutas existentes del formulario.
- Eliminar producto con confirmación, sin modificar otros productos.
- Ver fotos y eliminar una foto con confirmación; al quitar la portada se muestra la siguiente.
- Al quitar la última foto se conserva el producto con una imagen de reemplazo.
- Estados de carga, error con reintento, listado vacío e imagen ausente o rota.
- Diseño para escritorio y celular, diálogo con teclado y recuperación de foco.

## Datos temporales y límites de integración

La repartija de la actividad pide JSON sin backend. Por eso esta pantalla usa el adaptador aislado
`src/api/misProductosDemo.js`, con datos en `public/demo-mis-productos/`. Es una excepción temporal a la
regla general de `AGENTS.md` de usar `apiFetch`: la vista llama al adaptador, que lee archivos estáticos.
No se modificaron `public/data/`, el módulo compartido de productos, Navbar, rutas, estilos globales ni
dependencias. No hay cambios en el backend.

`USUARIO_DEMO` identifica al vendedor 1, Ana Pérez. Es una identidad local de demostración, no una respuesta
de login ni una sesión real. No escribe tokens ni datos de usuario en localStorage. La autorización real
sigue pendiente del trabajo de autenticación y, cuando se conecte la API, de las comprobaciones del servidor.

Las eliminaciones se guardan solamente en memoria: sobreviven al navegar dentro de la app y se restablecen
al recargar. No se escriben los JSON del disco ni se sincronizan otras pantallas. Las ilustraciones de los
productos también son de demostración.

Los botones Editar y Publicar llevan al formulario existente de la pantalla 6. En la copia revisada ese
formulario todavía es una pantalla de desarrollo. Esta implementación no agrega el formulario de Cari.

La Navbar compartida conserva su llamada preexistente a `/api/categorias`. Sin backend, no muestra esa barra
de categorías; Mis productos puede cargar igualmente. El equipo debe coordinar la simulación de esa llamada
si toda la entrega se va a ejecutar sin backend.

## Cómo integrar los aportes del equipo

1. Con Cari, acordar los archivos y las imágenes de `public/data/`. Reemplazar la fuente de datos del
   adaptador; no copiar estos ejemplos sobre sus archivos. Conservar casos de dos vendedores, sin stock,
   sin fotos y varias fotos.
2. Los productos usan `id`, `nombre`, `descripcion`, `precio`, `stock`, `categoriaId` y `usuarioId`.
   Las imágenes usan `id`, `nombreArchivo`, `tipoContenido`, `tamanio` y `url`. El JSON de imágenes agrupa
   arrays por id de producto como índice interno; cada consulta del adaptador devuelve el array de imágenes.
3. Con quien implementa autenticación, reemplazar `USUARIO_DEMO` por el usuario de `useAuth`, una vez que
   exista. Coordinar la protección de rutas y el estado sin sesión; no inventar otra sesión paralela.
4. Con Cari, conectar el formulario a la misma fuente de estado para que publicar, editar y eliminar se
   reflejen en ambas pantallas. Leer el mismo JSON por separado no sincroniza modificaciones en memoria.
5. Cuando corresponda conectar el backend, reemplazar las operaciones del adaptador por funciones que usen
   `apiFetch`, con los GET y DELETE del contrato. No alcanza con cambiar una URL: las bajas actuales son
   simuladas en memoria. Conservar la confirmación y actualizar la vista solo después de una respuesta exitosa.
6. Retirar el aviso de prueba, la identidad y los archivos de demo cuando ya no se utilicen.

## Pruebas

Desde la raíz del proyecto, con Node y npm disponibles:

```bash
npm run dev
node --test src/api/misProductosDemo.test.js
npm run lint
npm run build
```

Abrir `http://localhost:5173/mis-productos`. Se esperan cuatro publicaciones del vendedor 1 y ninguna del
vendedor 2. Probar cancelar y confirmar una baja, eliminar la portada y la última foto, y recargar para
recuperar los ejemplos. Eliminar las cuatro publicaciones debe mostrar el estado vacío.

Los nueve tests del adaptador comprueban aislamiento entre vendedores, bajas, datos inválidos, recuperación
de carga, copias de datos y reinicio de la simulación. También se verificó en Chrome la navegación, el foco
del diálogo, el error y reintento, imágenes rotas y anchos de 320 y 375 px sin desborde horizontal.

`npm run lint` y `npm run build` pasan. `npm run format:check` marca 63 archivos preexistentes fuera de este
cambio; no se reformatearon archivos de otros integrantes. Los archivos de esta implementación pasan el
chequeo de Prettier.

## Figma y wireflow pendientes

No se modificó el Figma compartido porque no se proporcionó su enlace. Llevar las capturas de escritorio y
celular al archivo del grupo y dibujar estas transiciones; luego avisar al responsable del punto 4:

- Mis productos → Publicar producto → formulario nuevo.
- Mis productos → Editar → formulario con el id seleccionado.
- Mis productos → Eliminar → confirmación → cancelar vuelve sin cambios / confirmar actualiza listado.
- Mis productos → Ver fotos → Eliminar foto → confirmación → galería actualizada.
- Último producto eliminado → listado vacío → Publicar producto.
- Error de carga → Reintentar → listado o mensaje de error.

## Mensaje para el grupo

> Avancé el punto 7 en feature/mis-productos: listado del vendedor, stock, enlaces para editar/publicar y
> eliminación de productos y fotos con confirmación. Para no depender de los archivos pendientes, usé JSON
> e ilustraciones temporales en una carpeta separada, sin tocar lo compartido. Por ahora usa un vendedor de
> prueba y las bajas se reinician al recargar. Falta integrar los JSON de Cari, la sesión y el estado del
> formulario para que se reflejen los cambios entre pantallas. Editar/Publicar ya apuntan a sus rutas, pero
> el formulario aún está pendiente en esta copia. También falta pasar el mockup y las flechas al Figma.
> La Navbar todavía consulta categorías al backend: eso se debe coordinar para la entrega con JSON.

La integración a `main` debe realizarse mediante un Pull Request de `feature/mis-productos`.
