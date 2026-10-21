# front-marketplaceUade

Front en React del marketplace de compra-venta de productos usados entre estudiantes de UADE
(Aplicaciones Interactivas, grupo 4). Consume la API REST de
[back-marketplaceUade](https://github.com/gnpar/back-marketplaceUade).

## Requisitos

- **Node 22.22 o superior** (recomendado Node 24 LTS). Si usás `nvm`, en la carpeta del proyecto corré `nvm use`
  y toma la versión de `.nvmrc`.
- Para que las pantallas traigan datos reales, el back corriendo en `http://localhost:8080` (ver el README del
  back; la forma más rápida es `./mvnw spring-boot:run -Dapp.profiles=h2`).

## Cómo correrlo

```bash
npm install
npm run dev
```

Se abre en [http://localhost:5173](http://localhost:5173). Por defecto la app usa los JSON de `public/data/`, así
que funciona sin back. Para usar el back real, creá `.env.local` con `VITE_USAR_MOCKS=false` y levantalo en el
puerto 8080: en desarrollo, Vite redirige todo lo que empieza con `/api` al back, así que no hace falta configurar
CORS ni URLs.

## Scripts

| Comando                | Qué hace                                      |
| ---------------------- | --------------------------------------------- |
| `npm run dev`          | Levanta el servidor de desarrollo con recarga |
| `npm run build`        | Genera la versión de producción en `dist/`    |
| `npm run preview`      | Sirve localmente lo generado por `build`      |
| `npm run lint`         | Revisa el código con oxlint                   |
| `npm run format`       | Formatea todo con Prettier                    |
| `npm run format:check` | Verifica el formato sin modificar archivos    |

## Pantallas

Las rutas están en `src/routes/AppRouter.jsx` y sus URLs en `src/routes/paths.js`. Cada pantalla está
implementada en su carpeta de `src/pages/`, con los endpoints o mocks correspondientes.

| Ruta                        | Pantalla                        | Carpeta                   | Acceso     |
| --------------------------- | ------------------------------- | ------------------------- | ---------- |
| `/`                         | Inicio (productos y categorías) | `pages/Home/`             | Pública    |
| `/login`                    | Ingresar                        | `pages/Login/`            | Pública    |
| `/registro`                 | Crear cuenta                    | `pages/Registro/`         | Pública    |
| `/productos/:id`            | Detalle de producto             | `pages/ProductoDetalle/`  | Pública    |
| `/categorias/:id`           | Productos de una categoría      | `pages/Categoria/`        | Pública    |
| `/compra`                   | Mi compra (compra en curso)     | `pages/Compra/`           | Con sesión |
| `/checkout`                 | Finalizar compra (resumen)      | `pages/Checkout/`         | Con sesión |
| `/compra/confirmada`        | Compra confirmada               | `pages/CompraConfirmada/` | Con sesión |
| `/mis-productos`            | Mis productos                   | `pages/MisProductos/`     | Con sesión |
| `/mis-productos/nuevo`      | Publicar producto               | `pages/ProductoForm/`     | Con sesión |
| `/mis-productos/:id/editar` | Editar producto y stock         | `pages/ProductoForm/`     | Con sesión |
| `/perfil`                   | Mi perfil                       | `pages/Perfil/`           | Con sesión |
| `/admin/categorias`         | Administrar categorías          | `pages/AdminCategorias/`  | Admin      |
| `/admin/usuarios`           | Administrar usuarios            | `pages/AdminUsuarios/`    | Admin      |
| cualquier otra              | Página no encontrada            | `pages/NotFound/`         | Pública    |

Las rutas "Con sesión" y "Admin" están envueltas en `RutaPrivada` y `RutaAdmin`: sin sesión redirigen al login y,
sin rol ADMIN, vuelven al inicio.

**Navegación.** El header tiene el buscador, "Publicar", el menú "Mi cuenta" (ingreso, perfil, mis productos y
administración), "Mi compra" y la barra de categorías (se carga desde el back). En celular todo eso va en el
menú lateral. Las pantallas que se abren desde otra (detalle, edición, compra confirmada) están en el botón
**Pantallas**, abajo a la derecha, que solo aparece con `npm run dev`.

## Estructura

```
src/
├── api/            client.js (el único lugar que llama a fetch) + un módulo por recurso
├── components/     compartidos: Navbar, Footer, EncabezadoPagina, EstadoVacio, Logo, MapaPantallas
├── context/        AuthContext
├── hooks/          useAuth, useCantidadCarrito
├── layouts/        MainLayout: header + contenido + footer
├── pages/          una carpeta por vista; adentro, components/ con los componentes de esa vista
├── routes/         AppRouter, paths y las guardas RutaPrivada / RutaAdmin
├── styles/         tokens.css (colores, tipografía, espaciado) y global.css
├── utils/          formatearPrecio, formatearFecha
└── main.jsx        punto de entrada
```

Cada componente vive en su carpeta con su `.jsx` y su `.module.css`. Los imports usan el alias `@` para `src/`
(`import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'`).

## Estilos base

Todo sale de `src/styles/tokens.css`: no se escriben colores ni tamaños a mano en los componentes.

| Token                    | Valor     | Uso                                  |
| ------------------------ | --------- | ------------------------------------ |
| `--color-primario`       | `#2547d0` | Botones principales, links, foco     |
| `--color-fondo`          | `#f6f7f9` | Fondo de la página                   |
| `--color-superficie`     | `#ffffff` | Tarjetas, header, formularios, menús |
| `--color-superficie-alt` | `#f1f3f6` | Buscador, zonas secundarias, hover   |
| `--color-borde`          | `#e3e6eb` | Bordes y separadores                 |
| `--color-texto`          | `#161a23` | Texto principal                      |
| `--color-texto-suave`    | `#5a6170` | Texto secundario                     |

Más colores de estado (éxito, error, aviso), escala tipográfica, espaciado, radios y sombras en el mismo archivo.
Tipografía **Figtree** (incluida como dependencia), íconos **lucide-react**. Diseño _mobile first_ con cortes en
480, 768 y 1024 px. Clases globales para botones (`.boton`, `.boton-primario`, `.boton-secundario`,
`.boton-fantasma`, `.boton-peligro`, `.boton-bloque`) y layout (`.contenedor`).

## Deploy en Vercel

El repo está vinculado a Vercel: cada push a `main` publica la versión de producción y cada PR genera un preview
con su propia URL.

`vercel.json` resuelve tres cosas:

- **Build.** Fija el framework (Vite), el comando (`npm run build`) y la carpeta de salida (`dist/`). Pisa lo que
  diga la configuración del proyecto en Vercel, así no depende de que alguien la toque.
- **Rutas del front.** Cualquier URL que no empiece con `/api/` devuelve `index.html`, así entrar directo a
  `/productos/3` o recargar la página no da 404.
- **Caché de la API.** Las respuestas de `/api` no se cachean en Vercel (son datos por usuario).

Mientras el back no esté publicado, el sitio en Vercel funciona pero sin datos: la barra de categorías no aparece
y las llamadas a `/api` dan error. Cuando el back tenga una URL pública, se agrega este rewrite **primero** en la
lista de `rewrites` de `vercel.json` (Vercel hace de proxy, así que tampoco hace falta CORS):

```json
{ "source": "/api/:path*", "destination": "https://URL-DEL-BACK/api/:path*" }
```

Para ver el botón **Pantallas** en los previews, en Vercel → Settings → Environment Variables agregá
`VITE_MOSTRAR_PANTALLAS` con valor `true` para el entorno Preview (y Production si lo quieren ahí también), y
volvé a desplegar.

## Cómo trabajamos

- [CONTRIBUTING.md](CONTRIBUTING.md): paso a paso para encarar tu pantalla, con un ejemplo completo.
- [AGENTS.md](AGENTS.md): las convenciones del proyecto (estructura, ruteo, API, estilos, textos, git). Si usás
  un asistente de IA (Claude Code, Copilot, Cursor, Codex), lo lee solo.
