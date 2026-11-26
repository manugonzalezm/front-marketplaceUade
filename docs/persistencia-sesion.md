# Persistencia de datos y de la sesión

Trabajo práctico grupal (TPG) sobre persistencia en el navegador. La consigna pide:

1. Persistir datos **no sensibles** en `localStorage` o `sessionStorage` (tema, idioma, etc.).
2. Persistir el token para que la sesión no se pierda al apretar **F5**, eligiendo y fundamentando una de tres
   soluciones, explicando cómo se mitigan los ataques de cada una, e implementarla en el TPO.

Este documento cubre el análisis, la decisión y cómo se probó. El código vive en este repo y en
[back-marketplaceUade](https://github.com/gnpar/back-marketplaceUade).

## 1. Datos no sensibles: tema claro / oscuro

Se agregó un botón para elegir tema claro u oscuro (en el header en escritorio y en el menú en celular). La
elección se guarda en `localStorage` y se mantiene al recargar o al volver otro día.

| Pieza                                   | Qué hace                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/store/slices/preferenciasSlice.js` | Estado `{ tema: 'claro' \| 'oscuro' }` y la acción `alternarTema()`                              |
| `src/store/persistencia.js`             | `leerPreferencias()` / `guardarPreferencias()` contra `localStorage['marketplace.preferencias']` |
| `src/store/store.js`                    | Arranca el slice con lo guardado (`preloadedState`) y guarda cada cambio (`store.subscribe`)     |
| `src/hooks/useAplicarTema.js`           | Pone `data-tema` en `<html>`; `tokens.css` cambia los colores según ese atributo                 |
| `src/components/Navbar/BotonTema/`      | El botón                                                                                         |

Decisiones:

- **`localStorage` y no `sessionStorage`**: `sessionStorage` se borra al cerrar la pestaña, y una preferencia de
  tema tiene que durar entre visitas.
- **Solo datos que no sirven a un atacante.** Si alguien lee o cambia el tema, no gana nada.
- **No se confía en lo que hay guardado.** `localStorage` lo puede editar el usuario o un script: al leerlo se
  valida contra la lista de temas válidos y, si no coincide, se usa el tema del sistema operativo. Así un valor
  adulterado no rompe la app ni se inyecta en ningún lado.
- **Aplicación del tema**: `useLayoutEffect` aplica la preferencia antes de pintar los cambios de React. Esto no garantiza evitar un destello durante la descarga inicial del JavaScript.

## 2. Sesión que sobrevive al F5

### Cómo estaba antes

La sesión vivía en un `AuthContext` que guardaba el **JWT y el usuario en `localStorage`**. O sea, ya estábamos
en la opción "fácil" de la consigna, con su problema: cualquier script que corra en la página puede hacer
`localStorage.getItem('marketplace.token')` y llevarse el token.

### Las tres opciones

|                        | Fácil: `localStorage`                            | Intermedio: `redux-persist`                         | Avanzado: cookie `HttpOnly`                                      |
| ---------------------- | ------------------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------- |
| Dónde queda el token   | `localStorage`, legible por JS                   | `localStorage` (o `sessionStorage`), legible por JS | Cookie que JS **no puede leer**                                  |
| Cambios en el back     | Ninguno                                          | Ninguno                                             | Sí: emitir/leer/borrar la cookie y CSRF                          |
| Robo del token con XSS | **Sí**: `localStorage.getItem(...)`              | **Sí**: `JSON.parse(localStorage['persist:root'])`  | **No**                                                           |
| CSRF                   | No aplica: el token se manda a mano en un header | No aplica                                           | **Aplica**: el navegador manda la cookie solo. Hay que mitigarlo |
| Sobrevive al F5        | Sí                                               | Sí                                                  | Sí (la cookie tiene `Max-Age`)                                   |

**Sobre `redux-persist`** (lo que había que investigar): es una librería que serializa el store (o parte) y lo
guarda en un _storage_ (por defecto `localStorage`); al arrancar lo "rehidrata". Es una comodidad para no
escribir a mano el `getItem`/`setItem`, pero **no cambia la seguridad**: el token termina en el mismo lugar y un
XSS lo lee igual. También suma una dependencia. Para persistir un JWT, no mejora la protección frente a XSS respecto de usar localStorage directamente.

### Decisión: opción avanzada (cookie `HttpOnly`)

Elegimos la cookie `HttpOnly` porque es la única de las tres en la que **el token no queda al alcance de
JavaScript**, así que un XSS no puede robarlo y usarlo desde otra máquina. Teníamos acceso al back y su costo (los
cambios en Spring y la protección CSRF) es acotado: Spring Security ya trae el mecanismo de CSRF y el front ya
pasaba todo por `apiFetch`, así que el cambio quedó concentrado en pocos archivos.

Además pasamos la sesión de `AuthContext` a un **`authSlice` de Redux**, igual que el carrito y los favoritos.
El hook `useAuth()` mantiene la misma interfaz para que las pantallas no cambien.

### Cómo funciona

```
LOGIN
  front  POST /api/usuarios/login { mail, contrasena }
  back   200 { usuario }                         <- el token NO viene en el body
         Set-Cookie: marketplace_token=<jwt>; HttpOnly; Secure; SameSite=Strict; Path=/api; Max-Age=86400
         Set-Cookie: XSRF-TOKEN=<aleatorio>; SameSite=Strict; Path=/
  front  authSlice.usuario = usuario             <- solo en memoria

F5 (o volver a abrir la app)
  Redux arranca vacío, pero la cookie sigue en el navegador.
  front  authSlice.estado = 'verificando'  ->  RutaPrivada muestra un spinner, no manda al login
  front  GET /api/usuarios/me                    (el navegador agrega la cookie solo)
  back   200 usuario  -> sesión recuperada  |  401 -> sin sesión

REQUEST QUE MODIFICA DATOS (POST / PUT / PATCH / DELETE)
  front  apiFetch lee document.cookie['XSRF-TOKEN'] y lo manda en el header X-XSRF-TOKEN
  back   si vino con la cookie de sesión, exige que header y cookie coincidan; si no, 403

LOGOUT
  front  POST /api/usuarios/logout  ->  back responde Set-Cookie: marketplace_token=; Max-Age=0
         authSlice.usuario = null

TOKEN VENCIDO
  back   401 a cualquier request  ->  apiFetch avisa  ->  authSlice cierra la sesión
```

## 3. Ataques y cómo se mitigan

### XSS (Cross-Site Scripting)

Un atacante logra ejecutar JavaScript en nuestra página (por ejemplo, con un comentario o un nombre de producto
que se renderiza como HTML).

| Solución                         | Impacto                                                                                                                           | Mitigación                                                                                                    |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `localStorage` / `redux-persist` | Roba el token y lo usa desde su máquina hasta que venza (24 h), aunque el usuario cierre la pestaña                               | Solo evitar el XSS; si ocurre, el token está perdido                                                          |
| Cookie `HttpOnly` (la nuestra)   | No puede leer el token (`document.cookie` no lo muestra). Sí puede hacer requests **mientras la víctima tiene la página abierta** | HttpOnly impide la lectura directa del JWT; un XSS puede actuar como el usuario y causar cambios persistentes |

`HttpOnly` reduce mucho el daño, pero no reemplaza evitar el XSS. Lo que ya hacemos:

- React escapa todo lo que se renderiza con `{}`; no usamos `dangerouslySetInnerHTML`.
- No hay datos sensibles en `localStorage`/`sessionStorage`: ni token ni usuario. Solo el tema, validado al leerlo.
- Las imágenes se validan en el back por tipo y firma binaria (no se puede subir un HTML disfrazado de imagen).
- Mejora posible: un header `Content-Security-Policy` en el deploy para bloquear scripts inline y de otros dominios.

### CSRF (Cross-Site Request Forgery)

Es el problema que **aparece** al usar cookies: el navegador manda la cookie sola en cada request a nuestro back,
aunque la request la dispare otro sitio. Por ejemplo, `sitio-malo.com` tiene un formulario oculto que hace
`POST /api/carrito/checkout` y lo envía al cargar la página. Con `localStorage` esto no pasaba, porque el token
había que agregarlo a mano en un header.

Defensas (en capas):

1. **`SameSite=Strict`** en la cookie de sesión: el navegador no la manda en requests que se originan en otro sitio.
   Es la primera barrera y cubre a todos los navegadores actuales.
2. **Token CSRF con el patrón _double submit cookie_** (Spring Security, `CookieCsrfTokenRepository`): el back
   manda un valor aleatorio en la cookie `XSRF-TOKEN` (legible por JS) y en todo `POST`/`PUT`/`PATCH`/`DELETE`
   autenticado con la cookie exige el mismo valor en el header `X-XSRF-TOKEN`. `sitio-malo.com` no puede leer
   cookies de nuestro dominio, así que no puede armar el header: el back responde **403**.
3. **Sin CORS configurado**: un sitio ajeno no puede mandar headers personalizados (`X-XSRF-TOKEN`,
   `Authorization`) a nuestro back, porque el navegador hace un _preflight_ que el back no autoriza.
4. **Los `GET` no modifican datos**, así que no necesitan token.

Las requests que se autentican con `Authorization: Bearer` (Postman, `requests.http`, tests) no piden el token
CSRF: el navegador nunca agrega ese header por su cuenta. Si una request trae ese header, el back ignora la cookie,
así nadie puede saltear el control mezclando las dos.

### Otros

| Ataque                                     | Mitigación                                                                                                                                                                                                                                                                          |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Robo de la cookie en la red (wifi pública) | `Secure`: solo viaja por HTTPS (los navegadores aceptan `localhost` por HTTP para desarrollo)                                                                                                                                                                                       |
| Que la cookie llegue a otros paths         | `Path=/api`: no se manda al pedir HTML, JS ni imágenes                                                                                                                                                                                                                              |
| Token adulterado o vencido                 | El back valida firma y vencimiento del JWT en cada request; si falla, 401 y el front cierra la sesión                                                                                                                                                                               |
| Sesión que no expira                       | `Max-Age` igual al vencimiento del JWT (24 h)                                                                                                                                                                                                                                       |
| Logout                                     | El back borra la cookie (`Max-Age=0`). **Limitación**: un JWT es _stateless_, así que si alguien hubiera copiado el token antes, seguiría valiendo hasta vencer. Con `HttpOnly` eso es mucho más difícil; para revocarlo de verdad haría falta una lista negra de tokens en el back |

## 4. Cómo probarlo

Con el back corriendo y `VITE_USAR_MOCKS=false` en `.env.local`:

1. Ingresar. En DevTools → _Application_ → _Cookies_: aparece `marketplace_token` con la columna **HttpOnly**
   tildada, y `XSRF-TOKEN` sin tildar. En _Local Storage_ solo está `marketplace.preferencias`.
2. En la consola, `document.cookie` muestra `XSRF-TOKEN=...` pero **no** el token de sesión.
3. Entrar a una ruta privada (ej. `/perfil`) y apretar **F5**: se ve "Recuperando tu sesión…" un instante y la
   pantalla sigue ahí, sin pasar por el login.
4. Simular CSRF desde la consola: `fetch('/api/usuarios/logout', { method: 'POST' }).then((r) => r.status)`
   devuelve **403** (va con la cookie pero sin el header). "Cerrar sesión" desde el menú sí funciona.
5. Cambiar el tema, apretar F5: se mantiene. Editar a mano `marketplace.preferencias` con cualquier valor y
   recargar: vuelve al tema por defecto.
6. En el back, `./mvnw test` corre `CookieSesionIntegrationTest`: atributos de la cookie, `/me`, logout, cookie
   adulterada y los casos de CSRF (sin token, token que no coincide, token correcto).

En **modo mock** (el default) no hay back: `src/api/mock.js` simula la cookie (guarda solo el id del usuario y el
vencimiento) para que el F5 también funcione. Ningún otro archivo la lee.

## 5. Para el deploy

La cookie es `SameSite=Strict` y el back no tiene CORS, así que el front y la API tienen que servirse **desde el
mismo dominio**: en desarrollo lo resuelve el proxy de Vite (`/api` → `localhost:8080`) y en producción tendría que
hacerlo un rewrite de `/api` en `vercel.json` hacia el back. Si algún día quedaran en dominios distintos, habría
que pasar a `SameSite=None` + CORS con `allowCredentials`, y el token CSRF pasaría a ser la defensa principal.
