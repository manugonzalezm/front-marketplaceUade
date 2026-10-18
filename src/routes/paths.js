// Única fuente de verdad de las URLs del front.
// En <Route> se usa el patrón tal cual; para armar links con parámetros usar
// generatePath de react-router:
//   generatePath(PATHS.productoDetalle, { id: producto.id })
export const PATHS = {
  // Públicas
  inicio: '/',
  login: '/login',
  registro: '/registro',
  productoDetalle: '/productos/:id',
  categoria: '/categorias/:id',

  // Requieren sesión iniciada
  compra: '/compra',
  compraConfirmada: '/compra/confirmada',
  misProductos: '/mis-productos',
  productoNuevo: '/mis-productos/nuevo',
  productoEditar: '/mis-productos/:id/editar',
  perfil: '/perfil',

  // Requieren rol ADMIN
  adminCategorias: '/admin/categorias',
  adminUsuarios: '/admin/usuarios',
}
