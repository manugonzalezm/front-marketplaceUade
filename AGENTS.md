# AGENTS.md — front-marketplaceUade

Guía para quien trabaje en este repo, persona o agente de IA. Si sos un agente: leé este archivo completo antes de
tocar código y respetalo aunque tu costumbre sea otra. Si una tarea te obliga a romper una regla, frená y
explicalo en la respuesta o en el PR en lugar de hacerlo en silencio.

## Qué es esto

Front en React del marketplace de productos usados entre estudiantes de UADE (proyecto universitario,
Aplicaciones Interactivas, grupo 4). Cualquier usuario registrado publica productos y otros los compran. El back
es una API REST en Spring Boot que vive en otro repo: [back-marketplaceUade](https://github.com/gnpar/back-marketplaceUade).
Su README es la fuente de verdad del contrato de la API (endpoints, permisos, validaciones, errores).

## Stack

| Qué      | Versión / elección                            | Ojo con                                                                                              |
| -------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| React    | 19                                            | Solo componentes funcionales y hooks                                                                 |
| Build    | Vite 8                                        | Variables de entorno con prefijo `VITE_`                                                             |
| Ruteo    | React Router 8, modo declarativo              | Se importa de `'react-router'`. `react-router-dom` ya no existe en v8: no lo instales ni lo importes |
| Lenguaje | JavaScript (JSX), sin TypeScript              | Documentar props y funciones no obvias con JSDoc                                                     |
| Estilos  | CSS Modules + tokens en CSS custom properties | Sin Tailwind, Bootstrap, MUI ni styled-components                                                    |
| Lint     | oxlint (`npm run lint`)                       |                                                                                                      |
| Formato  | Prettier (`npm run format`)                   | Sin punto y coma, comillas simples, 110 columnas                                                     |
| Node     | 22.22+ (`.nvmrc`: 24)                         |                                                                                                      |

No se agregan dependencias nuevas sin acordarlo con el grupo. Antes de instalar algo, fijate si se resuelve con
lo que ya hay (fetch, `Intl`, CSS).

## Comandos

```bash
npm install          # instalar dependencias
npm run dev          # http://localhost:5173, con proxy de /api al back en :8080
npm run build        # build de producción (tiene que pasar antes de abrir un PR)
npm run lint         # oxlint
npm run format       # prettier --write .
npm run format:check # lo que corre la revisión
```

## Estructura

```
src/
├── api/                 Acceso al back. client.js + un módulo por recurso
│   ├── client.js        apiFetch(): base /api, token, JSON, errores. Ya existe
│   ├── productos.js     (a crear) getProductos, getProducto, crearProducto...
│   ├── categorias.js    (a crear)
│   ├── carrito.js       (a crear)
│   ├── usuarios.js      (a crear) login, registro, perfil
│   └── imagenes.js      (a crear)
├── components/          Componentes reutilizables. Uno por carpeta:
│   └── ProductoCard/    ProductoCard.jsx + ProductoCard.module.css
├── context/             (a crear) AuthContext, CompraContext
├── hooks/               (a crear) hooks propios: useAuth, useCompra, ...
├── layouts/             MainLayout (navbar + <Outlet />)
├── pages/<seccion>/     Una pantalla por archivo, nombre terminado en Page
├── routes/              AppRouter.jsx, paths.js, RutaPrivada.jsx, RutaAdmin.jsx
├── styles/              tokens.css y global.css (los únicos CSS globales)
└── utils/               Funciones puras sin React (formato.js)
```

Reglas:

- Una página (`pages/`) arma la pantalla: trae los datos, maneja el estado y compone componentes. Un componente
  (`components/`) recibe todo por props y no sabe de rutas ni de la API, salvo que su nombre lo diga.
- Si un pedazo de UI se repite en dos pantallas, va a `components/`. Si solo lo usa una página, puede vivir como
  función en el mismo archivo hasta que haga falta en otro lado.
- Un componente por archivo, exportado por default, con el mismo nombre que el archivo.

## Nombres

- Dominio en español, igual que el back: `producto`, `categoria`, `carrito`, `usuario`, `pedido`, `stock`,
  `precio`. Los campos se llaman exactamente como en los DTO del back (`categoriaId`, `nombreUsuario`,
  `contrasena` sin ñ).
- Componentes y archivos `.jsx` en PascalCase (`ProductoCard.jsx`); páginas terminan en `Page`
  (`ProductoDetallePage.jsx`); hooks empiezan con `use` (`useAuth.js`); el resto en camelCase (`formato.js`).
- Handlers con `handle` (`handleSubmit`, `handleEliminar`) y props de eventos con `on` (`onEliminar`).
- Booleanos que se lean como pregunta: `esEdicion`, `cargando`, `tieneStock`.

## Ruteo

- Todas las rutas se declaran en `src/routes/AppRouter.jsx`, dentro de `MainLayout`. No hay `<Routes>` en otro
  lado.
- Todas las URLs salen de `src/routes/paths.js`. Nunca escribas `'/productos/' + id` a mano:

  ```jsx
  import { generatePath, Link } from 'react-router'
  import { PATHS } from '../routes/paths'

  ;<Link to={generatePath(PATHS.productoDetalle, { id: producto.id })}>{producto.nombre}</Link>
  ```

- Pantalla nueva: crear el archivo en `pages/<seccion>/`, agregar la URL en `paths.js`, registrarla en
  `AppRouter.jsx` dentro del grupo que corresponda (pública, `RutaPrivada` o `RutaAdmin`) y sumarla a la tabla
  del README.
- Para navegar como parte de una acción (después de guardar, de loguearse, etc.) usar `useNavigate`. Para
  links usar `<Link>` o `<NavLink>`, nunca `<a href>` interno (recarga la app y pierde el estado).
- Los parámetros de URL llegan como string: convertir con `Number(id)` antes de compararlos con ids del back.

## API

Todo pasa por `apiFetch` de `src/api/client.js`. Los componentes y páginas no llaman a `fetch` directo: llaman a
funciones de `src/api/<recurso>.js`.

```js
// src/api/productos.js
import { apiFetch } from './client'

export const getProductos = ({ categoriaId, usuarioId } = {}) => {
  const params = new URLSearchParams()
  if (categoriaId) params.set('categoriaId', categoriaId)
  if (usuarioId) params.set('usuarioId', usuarioId)
  const query = params.toString()
  return apiFetch(`/productos${query ? `?${query}` : ''}`)
}

export const crearProducto = (producto) => apiFetch('/productos', { method: 'POST', body: producto })
```

- Las rutas van sin host (`'/productos'`, no `http://localhost:8080/api/productos`). En desarrollo el proxy de
  Vite manda `/api` al 8080. El back no tiene CORS configurado: no cambies esto por una URL absoluta.
- Autenticación: JWT en el header `Authorization: Bearer <token>`. `apiFetch` lo agrega solo si hay token en
  `localStorage` bajo la clave `TOKEN_STORAGE_KEY`. El token dura 24 h; ante un 401 hay que cerrar la sesión y
  mandar al login.
- Errores: `apiFetch` tira `ApiError` con `status` y `message`. El back siempre responde
  `{ status, mensaje, timestamp }` y `mensaje` ya está pensado para mostrarse: mostralo tal cual en la pantalla.
- Imágenes: `POST /api/productos/{id}/imagenes` es `multipart/form-data` con el campo `archivo`. Pasale un
  `FormData` a `apiFetch` y no pongas `Content-Type` (lo arma el navegador). La `url` que devuelve cada imagen se
  usa directo en `<img src>`.

Particularidades del back que hay que resolver en el front:

- `GET /api/productos` devuelve también los productos con stock 0. En listados públicos (inicio, categoría)
  filtrar `stock > 0`; en "Mis productos" mostrarlos como pausados.
- `ProductoResponseDTO` trae `categoriaId` y `usuarioId`, no los nombres ni las imágenes. El nombre de la
  categoría sale de `GET /api/categorias` y las imágenes de `GET /api/productos/{id}/imagenes`.
- El registro no devuelve token: después de registrarse hay que loguearse.
- El checkout (`POST /api/carrito/checkout`) devuelve el pedido, pero no existe un GET de pedidos: la pantalla de
  confirmación recibe el pedido por `navigate(PATHS.compraConfirmada, { state: { pedido } })`.
- En la UI esto se llama "compra en curso" o "Mi compra", aunque el endpoint sea `/api/carrito`.

## Sesión y estado global

Estado local (`useState`) por defecto. Context solo para lo que necesitan muchas pantallas a la vez:

- `AuthContext` (`src/context/AuthContext.jsx` + hook `useAuth`). Expone
  `{ usuario, token, estaLogueado, esAdmin, login(mail, contrasena), logout() }`. Guarda el token en
  `localStorage[TOKEN_STORAGE_KEY]` y el usuario (el `UsuarioResponseDTO` del login) en
  `localStorage['marketplace.usuario']`. `RutaPrivada`, `RutaAdmin` y la `Navbar` leen de acá.
- `CompraContext` (opcional, si hace falta mostrar la cantidad de productos en la navbar). El back es la fuente
  de verdad: el context solo cachea `GET /api/carrito` y se refresca después de agregar, quitar o confirmar.

Sin Redux, Zustand ni librerías de estado.

## Estilos

- Cada componente tiene su `Componente.module.css` y se usa como `className={styles.algo}`. Los únicos CSS
  globales son `styles/tokens.css` y `styles/global.css`.
- Nada de valores sueltos: colores, tamaños de letra, espaciados, radios y sombras salen de `tokens.css`
  (`var(--color-tinta)`, `var(--espacio-4)`, `var(--texto-lg)`). Si falta un token, se agrega ahí y se avisa en
  el PR.
- Mobile first: los estilos base son para celular y se agregan `@media (min-width: …)` para pantallas más
  grandes. Cortes: 480, 768 y 1024 px. Probá cada pantalla a 320 px de ancho: no puede haber scroll horizontal.
- Paleta "azul birome + resaltador": `--color-tinta` para todo lo accionable, `--color-resaltador` como acento
  puntual (link activo, algún destacado) y siempre con texto oscuro encima, nunca como color de texto. Estados
  con `--color-exito`, `--color-error` y `--color-aviso` (y sus `-suave` para fondos).
- Botones: clases globales `.boton` + `.boton-primario` (una sola acción principal por pantalla),
  `.boton-secundario` o `.boton-peligro` (eliminar). Sirven en `<button>` y en `<Link>`.
- Radios según jerarquía: `--radio-sm` botones e inputs, `--radio-md` tarjetas, `--radio-pill` chips. Sombras
  solo en lo que flota o se toca (tarjetas de producto, menús).
- Precios y fechas siempre con `formatearPrecio` y `formatearFecha` de `src/utils/formato.js`.

## Formularios

- Inputs controlados, cada uno con su `<label htmlFor>`. Nada de placeholder en lugar de label.
- Validar en el front con las mismas reglas que el back, para avisar antes de mandar:
  - Usuario: `nombreUsuario` 3 a 30 caracteres; `mail` válido; `contrasena` 8 a 72 caracteres con al menos una
    letra y un número (opcional al editar el perfil); `nombre` y `apellido` obligatorios; `fechaNacimiento`
    pasada, formato `AAAA-MM-DD`; `sexo` `MASCULINO`, `FEMENINO` u `OTRO`.
  - Producto: `nombre` y `descripcion` obligatorios, hasta 255 caracteres; `precio` y `stock` mayores o iguales
    a 0; `categoriaId` obligatorio.
  - Imágenes: hasta 5 por producto, JPEG, PNG o WebP, 5 MB cada una.
- Error de un campo: `aria-invalid="true"` en el input y el mensaje debajo, asociado con `aria-describedby`.
- Mientras se envía, deshabilitar el botón y cambiar su texto ("Guardando…"). Si el back responde error, mostrar
  `error.message` arriba del formulario sin borrar lo que escribió el usuario.

## Carga, error y vacío

Toda pantalla que trae datos maneja tres estados además del normal:

- Cargando: un texto o esqueleto simple; nunca la pantalla en blanco.
- Error: qué pasó y qué hacer ("No pudimos cargar los productos. Revisá tu conexión y probá de nuevo." + botón
  para reintentar).
- Vacío: una invitación a actuar ("Todavía no publicaste productos." + botón "Publicar producto").

## Textos de la interfaz

- Español rioplatense con voseo, igual que el back ("Ingresá", "No tenés permisos"). Mayúscula solo al principio
  (no "Mis Productos").
- Botones con el verbo de lo que hacen: "Publicar producto", "Agregar a mi compra", "Guardar cambios",
  "Eliminar". Nada de "Enviar" o "Aceptar" genéricos.
- Vocabulario fijo en toda la app: "Ingresar" / "Crear cuenta" / "Cerrar sesión", "Mi compra" (no "carrito"),
  "Publicar", "Mis productos", "Sin stock".
- Los errores no piden perdón ni son vagos: dicen qué pasó y cómo seguir.

## Accesibilidad (mínimo obligatorio)

- HTML semántico: `<button>` para acciones, `<Link>` para navegar, un solo `<h1>` por página y títulos en orden.
- Toda `<img>` con `alt` descriptivo (el nombre del producto); `alt=""` solo si es decorativa.
- Áreas táctiles de al menos 44 px (`--alto-control`). Inputs con letra de 16 px o más.
- Foco visible: no quites el `outline` sin reemplazarlo.
- Íconos sin texto llevan un texto para lectores (`<span className="solo-lectores">`).

## Archivos compartidos

Estos archivos los usamos todos. Cambiarlos rompe el trabajo de otros, así que cualquier cambio va en un PR
propio o explicado en la descripción, y se avisa en el grupo:

`src/routes/AppRouter.jsx`, `src/routes/paths.js`, `src/styles/tokens.css`, `src/styles/global.css`,
`src/api/client.js`, `src/components/Navbar/`, `src/layouts/MainLayout.jsx`, `package.json`, este archivo.

## Git

- `main` siempre funciona. Se trabaja en una rama por pantalla o tarea: `feat/detalle-producto`,
  `fix/navbar-celular`.
- Commits chicos, en español e imperativo: `feat(compra): mostrar total de la compra en curso`.
- Antes de abrir el PR: `npm run lint`, `npm run format:check` y `npm run build` sin errores, y probar la
  pantalla en celular (320 px) y escritorio.
- No se suben `node_modules/`, `dist/` ni archivos `.env*.local`. `package-lock.json` sí se sube.

## Qué no hacer

- Instalar `react-router-dom`, axios, librerías de UI o de estado sin acordarlo.
- Llamar a `fetch` fuera de `src/api/`, o escribir `http://localhost:8080` en el código.
- Escribir colores, tamaños o URLs a mano en lugar de usar `tokens.css` y `paths.js`.
- Crear archivos `.css` globales nuevos o estilos inline (`style={{…}}`) para cosas que van en un module.
- Pasar a TypeScript, cambiar la estructura de carpetas o reformatear archivos ajenos dentro de un PR de otra
  cosa.
- Guardar la contraseña del usuario en ningún lado.
