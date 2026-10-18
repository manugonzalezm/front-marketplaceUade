# AGENTS.md — front-marketplaceUade

Guía para quien trabaje en este repo, persona o agente de IA. Si sos un agente: leé este archivo completo antes de
tocar código y respetalo aunque tu costumbre sea otra. Para implementar una pantalla, seguí además los pasos de
[CONTRIBUTING.md](CONTRIBUTING.md). Si una tarea te obliga a romper una regla, frená y explicalo en la respuesta o
en el PR en lugar de hacerlo en silencio.

## Qué es esto

Front en React del marketplace de productos usados entre estudiantes de UADE (proyecto universitario,
Aplicaciones Interactivas, grupo 4). Cualquier usuario registrado publica productos y otros los compran. El back
es una API REST en Spring Boot que vive en otro repo: [back-marketplaceUade](https://github.com/gnpar/back-marketplaceUade).
Su README es la fuente de verdad del contrato de la API (endpoints, permisos, validaciones, errores).

## Stack

| Qué      | Versión / elección                            | Ojo con                                                               |
| -------- | --------------------------------------------- | --------------------------------------------------------------------- |
| React    | 19                                            | Solo componentes funcionales y hooks                                  |
| Build    | Vite 8                                        | Variables de entorno con prefijo `VITE_`                              |
| Ruteo    | React Router 8, modo declarativo              | Se importa de `'react-router'`. `react-router-dom` ya no existe en v8 |
| Lenguaje | JavaScript (JSX), sin TypeScript              | Documentar props y funciones no obvias con JSDoc                      |
| Estilos  | CSS Modules + tokens en CSS custom properties | Sin Tailwind, Bootstrap, MUI ni styled-components                     |
| Íconos   | lucide-react                                  | Ningún otro set de íconos ni SVG copiados de internet                 |
| Lint     | oxlint (`npm run lint`)                       |                                                                       |
| Formato  | Prettier (`npm run format`)                   | Sin punto y coma, comillas simples, 110 columnas                      |
| Node     | 22.22+ (`.nvmrc`: 24)                         |                                                                       |

No se agregan dependencias nuevas sin acordarlo con el grupo. Antes de instalar algo, fijate si se resuelve con
lo que ya hay (fetch, `Intl`, CSS, `<dialog>`).

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
├── api/                        Acceso al back: client.js + un módulo por recurso
│   ├── client.js               apiFetch(): base /api, token, JSON, errores
│   └── categorias.js           ejemplo de módulo (productos.js, carrito.js, usuarios.js... a crear)
├── components/                 Componentes compartidos por dos o más pantallas
│   ├── EncabezadoPagina/       título + descripción + migas + acciones de cada pantalla
│   ├── EstadoVacio/            listas vacías, errores, "sin resultados"
│   ├── Footer/
│   ├── Logo/
│   ├── MapaPantallas/          atajos a todas las pantallas (solo en `npm run dev`)
│   └── Navbar/                 Navbar.jsx + sus partes: Buscador/, MenuCuenta/, MenuMovil/
├── context/                    (a crear) AuthContext, CompraContext
├── hooks/                      (a crear) useAuth, useCompra, ...
├── layouts/MainLayout.jsx      Navbar + <Outlet /> + Footer
├── pages/                      Una carpeta por vista (ver abajo)
├── routes/                     AppRouter.jsx, paths.js, RutaPrivada.jsx, RutaAdmin.jsx
├── styles/                     tokens.css y global.css (los únicos CSS globales)
└── utils/formato.js            formatearPrecio, formatearFecha
```

### Una carpeta por vista, un CSS por componente

```
src/pages/ProductoDetalle/
├── ProductoDetallePage.jsx           la vista: trae los datos, maneja el estado, arma la pantalla
├── ProductoDetallePage.module.css    solo layout de la vista (si hace falta)
└── components/                       componentes que usa SOLO esta vista
    └── PanelCompra/
        ├── PanelCompra.jsx
        └── PanelCompra.module.css
```

- Todo componente vive en su propia carpeta, con su `.jsx` y su `.module.css` con el mismo nombre. Nada de varios
  componentes en un archivo ni estilos de un componente en el CSS de otro.
- Si un componente lo usan dos o más vistas, va en `src/components/<Nombre>/`. Si arrancó en una vista y otra lo
  necesita, se mueve a `src/components/` (en un PR aparte o avisando).
- Una vista trae datos y maneja estado; sus componentes reciben todo por props y no llaman a la API ni leen la
  URL, salvo que su nombre lo diga (ej. `Buscador`).
- Un componente por archivo, exportado por default, con el mismo nombre que el archivo y la carpeta.
- Imports con el alias `@` para todo lo que esté fuera de la carpeta actual:
  `import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'`. Relativos (`./components/...`) solo para lo
  que está dentro de la misma vista o componente.

## Nombres

- Dominio en español, igual que el back: `producto`, `categoria`, `carrito`, `usuario`, `pedido`, `stock`,
  `precio`. Los campos se llaman exactamente como en los DTO del back (`categoriaId`, `nombreUsuario`,
  `contrasena` sin ñ).
- Carpetas de vistas y componentes, y archivos `.jsx`, en PascalCase (`ProductoDetalle/`, `PanelCompra.jsx`).
  Las vistas terminan en `Page` (`ProductoDetallePage.jsx`); los hooks empiezan con `use` (`useAuth.js`); el
  resto en camelCase (`formato.js`, `categorias.js`).
- Clases CSS en camelCase (`styles.sinStock`), describiendo qué es, no cómo se ve (`precio`, no `textoGrande`).
- Handlers con `handle` (`handleSubmit`, `handleEliminar`) y props de eventos con `on` (`onEliminar`).
- Booleanos que se lean como pregunta: `esEdicion`, `cargando`, `tieneStock`.

## Ruteo

- Todas las rutas se declaran en `src/routes/AppRouter.jsx`, dentro de `MainLayout`. No hay `<Routes>` en otro
  lado.
- Todas las URLs salen de `src/routes/paths.js`. Nunca escribas `'/productos/' + id` a mano:

  ```jsx
  import { generatePath, Link } from 'react-router'
  import { PATHS } from '@/routes/paths'

  ;<Link to={generatePath(PATHS.productoDetalle, { id: producto.id })}>{producto.nombre}</Link>
  ```

- Vista nueva: crear `src/pages/<Vista>/<Vista>Page.jsx`, agregar la URL en `paths.js`, registrarla en
  `AppRouter.jsx` dentro del grupo que corresponda (pública, `RutaPrivada` o `RutaAdmin`), sumarla a
  `MapaPantallas` y a la tabla del README.
- Para navegar como parte de una acción (después de guardar, de loguearse) usar `useNavigate`. Para links usar
  `<Link>` o `<NavLink>`, nunca `<a href>` interno (recarga la app y pierde el estado).
- Los parámetros de URL llegan como string: convertir con `Number(id)` antes de compararlos con ids del back.
- El buscador del header manda al inicio con `?q=texto`; el inicio filtra por nombre (no hay endpoint de búsqueda).

## API

Todo pasa por `apiFetch` de `src/api/client.js`. Las vistas no llaman a `fetch` directo: llaman a funciones de
`src/api/<recurso>.js` (ver `categorias.js`).

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
  Vite manda `/api` al 8080; en Vercel lo hace un rewrite de `vercel.json`. El back no tiene CORS configurado: no
  cambies esto por una URL absoluta ni por una variable `VITE_API_URL`.
- Autenticación: JWT en el header `Authorization: Bearer <token>`. `apiFetch` lo agrega solo si hay token en
  `localStorage` bajo la clave `TOKEN_STORAGE_KEY`. El token dura 24 h; ante un 401 hay que cerrar la sesión y
  mandar al login.
- Errores: `apiFetch` tira `ApiError` con `status` y `message`. El back siempre responde
  `{ status, mensaje, timestamp }` y `mensaje` ya está pensado para mostrarse: mostralo tal cual.
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

- `AuthContext` (`src/context/AuthContext.jsx` + hook `src/hooks/useAuth.js`). Expone
  `{ usuario, token, estaLogueado, esAdmin, login(mail, contrasena), logout() }`. Guarda el token en
  `localStorage[TOKEN_STORAGE_KEY]` y el usuario (el `UsuarioResponseDTO` del login) en
  `localStorage['marketplace.usuario']`. `RutaPrivada`, `RutaAdmin`, `MenuCuenta` y `MenuMovil` leen de acá (ya
  tienen comentarios `TODO (auth)` donde va cada cosa).
- `CompraContext` (opcional, si hace falta mostrar la cantidad de productos en el header). El back es la fuente
  de verdad: el context solo cachea `GET /api/carrito` y se refresca después de agregar, quitar o confirmar.

Sin Redux, Zustand ni librerías de estado.

## Estilos

- Cada componente tiene su `Componente.module.css` y se usa como `className={styles.algo}`. Los únicos CSS
  globales son `styles/tokens.css` y `styles/global.css`. Nada de `style={{…}}` salvo valores que se calculan en
  tiempo de ejecución.
- Nada de valores sueltos: colores, tamaños de letra, espaciados, radios y sombras salen de `tokens.css`
  (`var(--color-primario)`, `var(--espacio-4)`, `var(--texto-lg)`). Si falta un token, se agrega ahí y se avisa
  en el PR.
- Mobile first: los estilos base son para celular y se agregan `@media (min-width: …)` para pantallas más
  grandes. Cortes: 480, 768 y 1024 px. Probá cada pantalla a 320 px de ancho: no puede haber scroll horizontal.
- Paleta: fondo gris muy claro (`--color-fondo`), superficies blancas con borde (`--color-superficie`,
  `--color-borde`), un solo color de marca para lo accionable (`--color-primario`) y colores de estado
  (`--color-exito`, `--color-error`, `--color-aviso`, con sus `-suave` para fondos). No inventes colores nuevos.
- Botones: clases globales `.boton` + `.boton-primario` (una sola acción principal por pantalla),
  `.boton-secundario`, `.boton-fantasma` o `.boton-peligro`, y `.boton-bloque` para ancho completo. Sirven en
  `<button>` y en `<Link>`.
- Radios según jerarquía: `--radio-sm` botones e inputs, `--radio-md` tarjetas y menús, `--radio-lg` bloques
  grandes, `--radio-pill` chips y badges. Sombras solo en lo que flota o se toca (`--sombra-tarjeta`,
  `--sombra-flotante`); el resto se separa con bordes.
- Cada pantalla arranca con `EncabezadoPagina`; los vacíos y errores usan `EstadoVacio`.
- Íconos de `lucide-react` con `size` 16 a 24 y `aria-hidden="true"` cuando acompañan un texto.
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

Toda vista que trae datos maneja tres estados además del normal:

- Cargando: un texto o esqueleto simple; nunca la pantalla en blanco.
- Error: `EstadoVacio` con qué pasó y qué hacer ("No pudimos cargar los productos." + botón para reintentar o
  volver).
- Vacío: `EstadoVacio` con una invitación a actuar ("Todavía no publicaste productos." + botón
  "Publicar producto").

## Textos de la interfaz

- Español rioplatense con voseo, igual que el back ("Ingresá", "No tenés permisos"). Mayúscula solo al principio
  (no "Mis Productos").
- Botones con el verbo de lo que hacen: "Publicar producto", "Agregar a mi compra", "Guardar cambios",
  "Eliminar". Nada de "Enviar" o "Aceptar" genéricos.
- Vocabulario fijo en toda la app: "Ingresar" / "Crear cuenta" / "Cerrar sesión", "Mi compra" (no "carrito"),
  "Publicar", "Mis productos", "Sin stock".
- Los errores no piden perdón ni son vagos: dicen qué pasó y cómo seguir.

## Accesibilidad (mínimo obligatorio)

- HTML semántico: `<button>` para acciones, `<Link>` para navegar, un solo `<h1>` por página (lo pone
  `EncabezadoPagina`) y títulos en orden.
- Toda `<img>` con `alt` descriptivo (el nombre del producto); `alt=""` solo si es decorativa.
- Áreas táctiles de al menos 44 px (`--alto-control`). Inputs con letra de 16 px o más.
- Foco visible: no quites el `outline` sin reemplazarlo.
- Íconos sin texto llevan un texto para lectores (`<span className="solo-lectores">`).

## Archivos compartidos

Estos archivos los usamos todos. Cambiarlos rompe el trabajo de otros, así que cualquier cambio va en un PR
propio o explicado en la descripción, y se avisa en el grupo:

`src/routes/`, `src/styles/`, `src/api/client.js`, `src/components/` (Navbar, Footer, EncabezadoPagina,
EstadoVacio, Logo, MapaPantallas), `src/layouts/MainLayout.jsx`, `package.json`, `vite.config.js`, `vercel.json`,
este archivo y `CONTRIBUTING.md`.

## Git

- `main` siempre funciona. Se trabaja en una rama por pantalla o tarea: `feat/detalle-producto`,
  `fix/navbar-celular`.
- Commits chicos, en español e imperativo: `feat(compra): mostrar total de la compra en curso`.
- Antes de abrir el PR: `npm run lint`, `npm run format:check` y `npm run build` sin errores, y probar la
  pantalla en celular (320 px) y escritorio.
- No se suben `node_modules/`, `dist/` ni archivos `.env*.local`. `package-lock.json` sí se sube.

## Qué no hacer

- Instalar `react-router-dom`, axios, librerías de UI, de íconos o de estado sin acordarlo.
- Llamar a `fetch` fuera de `src/api/`, o escribir `http://localhost:8080` en el código.
- Escribir colores, tamaños o URLs a mano en lugar de usar `tokens.css` y `paths.js`.
- Poner componentes sueltos en `pages/` fuera de la carpeta `components/` de su vista, o varios componentes en
  un mismo archivo.
- Crear archivos `.css` globales nuevos.
- Pasar a TypeScript, cambiar la estructura de carpetas o reformatear archivos ajenos dentro de un PR de otra
  cosa.
- Guardar la contraseña del usuario en ningún lado.
