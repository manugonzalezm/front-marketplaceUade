# Cómo encarar tu pantalla

Guía paso a paso para implementar una pantalla del marketplace. Las reglas de fondo (estructura, API, estilos,
textos) están en [AGENTS.md](AGENTS.md); acá va el orden en que conviene hacer las cosas y un ejemplo completo.

## 1. Actualizá el repo y creá tu rama

```bash
git checkout main
git pull
npm install
git checkout -b feat/detalle-producto   # una rama por pantalla
npm run dev                              # http://localhost:5173
```

Para trabajar con datos reales, levantá el back en el 8080 (en `back-marketplaceUade`):

```bash
./mvnw spring-boot:run -Dapp.profiles=h2   # base en memoria, no necesita MySQL
```

El botón **Pantallas** abajo a la derecha (solo en desarrollo) te lleva a cualquier pantalla, incluidas las que
todavía no tienen link.

## 2. Encontrá tu vista

Cada pantalla ya existe, tiene su ruta y su carpeta en `src/pages/`:

| Pantalla                      | Carpeta                                                  |
| ----------------------------- | -------------------------------------------------------- |
| Inicio                        | `src/pages/Home/`                                        |
| Ingresar / Crear cuenta       | `src/pages/Login/`, `src/pages/Registro/`                |
| Detalle de producto           | `src/pages/ProductoDetalle/`                             |
| Productos de una categoría    | `src/pages/Categoria/`                                   |
| Mi compra / Compra confirmada | `src/pages/Compra/`, `src/pages/CompraConfirmada/`       |
| Finalizar compra (checkout)   | `src/pages/Checkout/`                                    |
| Mis productos                 | `src/pages/MisProductos/`                                |
| Publicar / Editar producto    | `src/pages/ProductoForm/`                                |
| Mi perfil                     | `src/pages/Perfil/`                                      |
| Admin: categorías / usuarios  | `src/pages/AdminCategorias/`, `src/pages/AdminUsuarios/` |

Abrí el `...Page.jsx`: arriba hay un comentario con qué tiene que mostrar, qué endpoints usar y qué componentes se
sugieren. No hace falta tocar `AppRouter.jsx` ni `paths.js`.

## 3. Dividí la pantalla en componentes

Antes de escribir código, dibujá la pantalla (en papel alcanza) y marcá los bloques. Cada bloque con una
responsabilidad clara es un componente. Ejemplo, detalle de producto:

```
┌────────────────────────────────────────────────────┐
│ EncabezadoPagina  (Inicio > Nombre del producto)   │  ← compartido, ya existe
├──────────────────────────────┬─────────────────────┤
│ GaleriaImagenes              │ PanelCompra         │
│                              │  precio, stock,     │
│                              │  cantidad, botón    │
├──────────────────────────────┤                     │
│ InfoProducto                 │                     │
│  descripción, categoría      │                     │
└──────────────────────────────┴─────────────────────┘
```

Para cada componente decidí dónde va:

| Si el componente…                                | Va en                                      |
| ------------------------------------------------ | ------------------------------------------ |
| solo lo usa tu pantalla                          | `src/pages/<TuVista>/components/<Nombre>/` |
| lo usan dos o más pantallas (ej. `ProductoCard`) | `src/components/<Nombre>/`                 |

Si después otra pantalla necesita un componente tuyo, se mueve a `src/components/` en un PR aparte.

## 4. Creá cada componente en su carpeta, con su CSS

```
src/pages/ProductoDetalle/
├── ProductoDetallePage.jsx           la vista: trae datos y arma la pantalla
├── ProductoDetallePage.module.css    solo el layout de la vista (grilla, columnas)
└── components/
    ├── GaleriaImagenes/
    │   ├── GaleriaImagenes.jsx
    │   └── GaleriaImagenes.module.css
    ├── InfoProducto/
    │   ├── InfoProducto.jsx
    │   └── InfoProducto.module.css
    └── PanelCompra/
        ├── PanelCompra.jsx
        └── PanelCompra.module.css
```

Un componente recibe todo por props y no llama a la API. Ejemplo:

```jsx
// src/pages/ProductoDetalle/components/PanelCompra/PanelCompra.jsx
import { formatearPrecio } from '@/utils/formato'
import styles from './PanelCompra.module.css'

/**
 * Precio, stock y botón para agregar el producto a la compra en curso.
 * @param {{ producto: { precio: number, stock: number }, agregando: boolean, onAgregar: () => void }} props
 */
export default function PanelCompra({ producto, agregando, onAgregar }) {
  const tieneStock = producto.stock > 0

  return (
    <aside className={styles.panel}>
      <p className={styles.precio}>{formatearPrecio(producto.precio)}</p>

      {tieneStock ? (
        <p className={styles.stock}>{producto.stock} disponibles</p>
      ) : (
        <p className={styles.sinStock}>Sin stock</p>
      )}

      <button
        type="button"
        className="boton boton-primario boton-bloque"
        disabled={!tieneStock || agregando}
        onClick={onAgregar}
      >
        {agregando ? 'Agregando…' : 'Agregar a mi compra'}
      </button>
    </aside>
  )
}
```

```css
/* src/pages/ProductoDetalle/components/PanelCompra/PanelCompra.module.css */
.panel {
  display: grid;
  gap: var(--espacio-3);
  padding: var(--espacio-5);
  background: var(--color-superficie);
  border: 1px solid var(--color-borde);
  border-radius: var(--radio-md);
}

.precio {
  margin: 0;
  font-size: var(--texto-2xl);
  font-weight: var(--peso-bold);
}

.stock {
  margin: 0;
  color: var(--color-texto-suave);
}

.sinStock {
  margin: 0;
  color: var(--color-aviso);
  font-weight: var(--peso-semibold);
}
```

## 5. Estilos: las reglas cortas

- Un `.module.css` por componente, con el mismo nombre. Se usa como `className={styles.panel}`.
- Solo variables de `src/styles/tokens.css`: `var(--color-primario)`, `var(--espacio-4)`, `var(--texto-lg)`,
  `var(--radio-md)`. Nada de `#2547d0`, `16px` ni `14px` escritos a mano. Si falta un valor, se agrega a
  `tokens.css` y se avisa.
- Mobile first: lo base es para celular; escritorio se agrega con `@media (min-width: 768px)`.
- Botones con las clases globales: `boton boton-primario` (una sola acción principal por pantalla),
  `boton-secundario`, `boton-fantasma`, `boton-peligro`, y `boton-bloque` para ancho completo.
- Íconos de `lucide-react`: `import { Trash2 } from 'lucide-react'` y `<Trash2 size={18} aria-hidden="true" />`.

## 6. Datos: API en `src/api/`, estado en la vista

Si no existe, creá el módulo del recurso usando `apiFetch` (mirá `src/api/categorias.js` de ejemplo). Si ya existe,
sumá tu función ahí.

```js
// src/api/productos.js
import { apiFetch } from './client'

export const getProducto = (id) => apiFetch(`/productos/${id}`)
```

```js
// src/api/carrito.js
import { apiFetch } from './client'

export const agregarAlCarrito = ({ productoId, cantidad }) =>
  apiFetch('/carrito', { method: 'POST', body: { productoId, cantidad } })
```

La vista trae los datos, maneja carga / error / vacío y le pasa todo a los componentes:

```jsx
// src/pages/ProductoDetalle/ProductoDetallePage.jsx
import { PackageX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { agregarAlCarrito } from '@/api/carrito'
import { getProducto } from '@/api/productos'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'
import InfoProducto from './components/InfoProducto/InfoProducto'
import PanelCompra from './components/PanelCompra/PanelCompra'
import styles from './ProductoDetallePage.module.css'

export default function ProductoDetallePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [error, setError] = useState(null)
  const [agregando, setAgregando] = useState(false)
  const [errorCompra, setErrorCompra] = useState(null)

  useEffect(() => {
    let cancelado = false // evita actualizar el estado si el usuario ya se fue de la página
    getProducto(id)
      .then((datos) => {
        if (!cancelado) setProducto(datos)
      })
      .catch((err) => {
        if (!cancelado) setError(err.message)
      })
    return () => {
      cancelado = true
    }
  }, [id])

  const handleAgregar = async () => {
    setAgregando(true)
    setErrorCompra(null)
    try {
      await agregarAlCarrito({ productoId: producto.id, cantidad: 1 })
      navigate(PATHS.compra)
    } catch (err) {
      setErrorCompra(err.message) // ej.: "No hay stock suficiente" que manda el back
      setAgregando(false)
    }
  }

  if (error) {
    return (
      <EstadoVacio icono={PackageX} titulo="No pudimos mostrar el producto" descripcion={error}>
        <Link to={PATHS.inicio} className="boton boton-secundario">
          Volver al inicio
        </Link>
      </EstadoVacio>
    )
  }

  if (!producto) return <p className="texto-suave">Cargando producto…</p>

  return (
    <>
      <EncabezadoPagina
        titulo={producto.nombre}
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: producto.nombre }]}
      />
      {errorCompra && (
        <p role="alert" className={styles.error}>
          {errorCompra}
        </p>
      )}
      <div className={styles.contenido}>
        <InfoProducto producto={producto} />
        <PanelCompra producto={producto} agregando={agregando} onAgregar={handleAgregar} />
      </div>
    </>
  )
}
```

```css
/* src/pages/ProductoDetalle/ProductoDetallePage.module.css: solo layout */
.contenido {
  display: grid;
  gap: var(--espacio-5);
}

.error {
  padding: var(--espacio-3) var(--espacio-4);
  color: var(--color-error);
  background: var(--color-error-suave);
  border-radius: var(--radio-sm);
}

@media (min-width: 768px) {
  .contenido {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    align-items: start;
  }
}
```

## 7. Usá los componentes compartidos

| Componente                                                   | Para qué                                                      |
| ------------------------------------------------------------ | ------------------------------------------------------------- |
| `EncabezadoPagina`                                           | Título, descripción, migas de pan y acciones de cada pantalla |
| `EstadoVacio`                                                | Listas vacías, errores de carga, búsquedas sin resultados     |
| `formatearPrecio`, `formatearFecha` (`src/utils/formato.js`) | Mostrar precios y fechas                                      |

Cuando tu pantalla esté lista, borrá el `EstadoVacio` de "Pantalla en desarrollo".

## 8. Coordiná lo que se comparte

Algunas piezas las necesitan varias pantallas. Las hace una sola persona y los demás esperan o usan un dato de
prueba mientras tanto. Anoten acá quién se encarga:

| Pieza                         | La usan                                                  | Responsable |
| ----------------------------- | -------------------------------------------------------- | ----------- |
| `AuthContext` + `useAuth`     | Login, rutas protegidas, navbar, todo lo que pide sesión | _a definir_ |
| `src/components/ProductoCard` | Inicio, Categoría, Mis productos                         | _a definir_ |
| `src/api/productos.js`        | Inicio, Categoría, Detalle, Mis productos, Publicar      | _a definir_ |
| `src/api/carrito.js`          | Detalle, Mi compra                                       | _a definir_ |

## 9. Probá

- En el navegador con las herramientas de desarrollo en modo celular (320 px y 375 px) y en escritorio. No puede
  aparecer scroll horizontal.
- Con el back apagado o devolviendo error: la pantalla tiene que mostrar el error, no quedarse en blanco.
- Recorré la pantalla solo con el teclado (Tab, Enter, Escape): todo se tiene que poder usar y el foco se tiene
  que ver.

## 10. Abrí el PR

```bash
npm run lint
npm run format
npm run build
git add .
git commit -m "feat(detalle): mostrar producto con imágenes y agregar a la compra"
git push -u origin feat/detalle-producto
```

En GitHub, abrí el PR contra `main` con una captura en celular y otra en escritorio. Si tocaste algún archivo
compartido (rutas, tokens, `global.css`, navbar, `client.js`), explicá por qué en la descripción.

## Si usás un asistente de IA

Claude Code, Copilot, Cursor y Codex leen `AGENTS.md` solos. Alcanza con pedir:

> Implementá la pantalla de detalle de producto siguiendo AGENTS.md y CONTRIBUTING.md.

Revisá lo que genera antes de commitear: que respete la estructura de carpetas, que use los tokens y que no
instale dependencias nuevas.
