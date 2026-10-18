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

Se abre en [http://localhost:5173](http://localhost:5173). En desarrollo, Vite redirige todo lo que empieza con
`/api` al back en el puerto 8080, así que no hace falta configurar CORS ni URLs.

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

Todas las rutas están definidas en `src/routes/AppRouter.jsx` y sus URLs en `src/routes/paths.js`. Por ahora
cada página es un título y un comentario con los endpoints que va a usar.

| Ruta                        | Pantalla                        | Archivo                                   | Acceso     |
| --------------------------- | ------------------------------- | ----------------------------------------- | ---------- |
| `/`                         | Inicio (productos y categorías) | `pages/HomePage.jsx`                      | Pública    |
| `/login`                    | Ingresar                        | `pages/auth/LoginPage.jsx`                | Pública    |
| `/registro`                 | Crear cuenta                    | `pages/auth/RegistroPage.jsx`             | Pública    |
| `/productos/:id`            | Detalle de producto             | `pages/productos/ProductoDetallePage.jsx` | Pública    |
| `/categorias/:id`           | Productos de una categoría      | `pages/productos/CategoriaPage.jsx`       | Pública    |
| `/compra`                   | Mi compra (compra en curso)     | `pages/compra/CompraPage.jsx`             | Con sesión |
| `/compra/confirmada`        | Compra confirmada               | `pages/compra/CompraConfirmadaPage.jsx`   | Con sesión |
| `/mis-productos`            | Mis productos                   | `pages/vendedor/MisProductosPage.jsx`     | Con sesión |
| `/mis-productos/nuevo`      | Publicar producto               | `pages/vendedor/ProductoFormPage.jsx`     | Con sesión |
| `/mis-productos/:id/editar` | Editar producto y stock         | `pages/vendedor/ProductoFormPage.jsx`     | Con sesión |
| `/perfil`                   | Mi perfil                       | `pages/usuario/PerfilPage.jsx`            | Con sesión |
| `/admin/categorias`         | Administrar categorías          | `pages/admin/AdminCategoriasPage.jsx`     | Admin      |
| `/admin/usuarios`           | Administrar usuarios            | `pages/admin/AdminUsuariosPage.jsx`       | Admin      |
| cualquier otra              | Página no encontrada            | `pages/NotFoundPage.jsx`                  | Pública    |

Las rutas "Con sesión" y "Admin" ya están envueltas en `RutaPrivada` y `RutaAdmin`, que por ahora dejan pasar a
todos; cuando esté el login van a redirigir.

La navbar tiene links a todas las pantallas. Las que se abren desde otra página (detalle, edición, compra
confirmada) aparecen en la franja "Atajos de desarrollo", que solo se ve con `npm run dev`.

## Estructura

```
src/
├── api/            client.js: el único lugar que llama a fetch
├── components/     componentes reutilizables (Navbar, y lo que vayamos sumando)
├── layouts/        MainLayout: navbar + contenido de cada página
├── pages/          una carpeta por sección, un archivo por pantalla
├── routes/         AppRouter, paths y las guardas RutaPrivada / RutaAdmin
├── styles/         tokens.css (colores, tipografía, espaciado) y global.css
├── utils/          formatearPrecio, formatearFecha
└── main.jsx        punto de entrada
```

## Estilos base

Todo sale de `src/styles/tokens.css`: no se escriben colores ni tamaños a mano en los componentes.

| Token                 | Valor     | Uso                                      |
| --------------------- | --------- | ---------------------------------------- |
| `--color-tinta`       | `#1f3fbf` | Botones principales, links, foco         |
| `--color-resaltador`  | `#c8f169` | Acento puntual (link activo, destacados) |
| `--color-fondo`       | `#f5f6fa` | Fondo de la página                       |
| `--color-superficie`  | `#ffffff` | Tarjetas, navbar, formularios            |
| `--color-texto`       | `#1a1d29` | Texto principal                          |
| `--color-texto-suave` | `#5b6175` | Texto secundario                         |

Tipografía: **Figtree** (incluida como dependencia, no depende de Google Fonts), escala 1.25 sobre 16 px.
Diseño _mobile first_ con cortes en 480, 768 y 1024 px. Hay clases globales para botones (`.boton`,
`.boton-primario`, `.boton-secundario`, `.boton-peligro`) y layout (`.contenedor`).

## Cómo trabajamos

Las convenciones del proyecto (estructura, ruteo, API, estilos, textos, git) están en [AGENTS.md](AGENTS.md).
Leelo antes de empezar tu parte; si usás un asistente de IA (Claude Code, Copilot, Cursor, Codex), lo lee solo.
