import { Route, Routes } from 'react-router'
import MainLayout from '../layouts/MainLayout'
import AdminCategoriasPage from '../pages/admin/AdminCategoriasPage'
import AdminUsuariosPage from '../pages/admin/AdminUsuariosPage'
import LoginPage from '../pages/auth/LoginPage'
import RegistroPage from '../pages/auth/RegistroPage'
import CompraConfirmadaPage from '../pages/compra/CompraConfirmadaPage'
import CompraPage from '../pages/compra/CompraPage'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import CategoriaPage from '../pages/productos/CategoriaPage'
import ProductoDetallePage from '../pages/productos/ProductoDetallePage'
import PerfilPage from '../pages/usuario/PerfilPage'
import MisProductosPage from '../pages/vendedor/MisProductosPage'
import ProductoFormPage from '../pages/vendedor/ProductoFormPage'
import { PATHS } from './paths'
import RutaAdmin from './RutaAdmin'
import RutaPrivada from './RutaPrivada'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Públicas */}
        <Route index element={<HomePage />} />
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route path={PATHS.registro} element={<RegistroPage />} />
        <Route path={PATHS.productoDetalle} element={<ProductoDetallePage />} />
        <Route path={PATHS.categoria} element={<CategoriaPage />} />

        {/* Requieren sesión iniciada */}
        <Route element={<RutaPrivada />}>
          <Route path={PATHS.compra} element={<CompraPage />} />
          <Route path={PATHS.compraConfirmada} element={<CompraConfirmadaPage />} />
          <Route path={PATHS.misProductos} element={<MisProductosPage />} />
          <Route path={PATHS.productoNuevo} element={<ProductoFormPage />} />
          <Route path={PATHS.productoEditar} element={<ProductoFormPage />} />
          <Route path={PATHS.perfil} element={<PerfilPage />} />

          {/* Requieren rol ADMIN */}
          <Route element={<RutaAdmin />}>
            <Route path={PATHS.adminCategorias} element={<AdminCategoriasPage />} />
            <Route path={PATHS.adminUsuarios} element={<AdminUsuariosPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
