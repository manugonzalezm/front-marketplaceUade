import { Layers, Package, Plus, ShoppingBag, User, Users } from 'lucide-react'
import { PATHS } from '@/routes/paths'

// Links compartidos entre el menú "Mi cuenta" (escritorio) y el menú de celular.

// TODO (auth): mostrar solo con sesión iniciada.
export const LINKS_CUENTA = [
  { to: PATHS.perfil, texto: 'Mi perfil', icono: User },
  { to: PATHS.misProductos, texto: 'Mis productos', icono: Package, end: true },
  { to: PATHS.productoNuevo, texto: 'Publicar producto', icono: Plus },
  { to: PATHS.compra, texto: 'Mi compra', icono: ShoppingBag, end: true },
]

// TODO (auth): mostrar solo si usuario.rol === 'ADMIN'.
export const LINKS_ADMIN = [
  { to: PATHS.adminCategorias, texto: 'Categorías', icono: Layers },
  { to: PATHS.adminUsuarios, texto: 'Usuarios', icono: Users },
]
