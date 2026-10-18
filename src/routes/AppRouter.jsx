import { Route, Routes } from 'react-router'
import MainLayout from '@/layouts/MainLayout'
import AdminCategoriasPage from '@/pages/AdminCategorias/AdminCategoriasPage'
import AdminUsuariosPage from '@/pages/AdminUsuarios/AdminUsuariosPage'
import CategoriaPage from '@/pages/Categoria/CategoriaPage'
import CompraPage from '@/pages/Compra/CompraPage'
import CompraConfirmadaPage from '@/pages/CompraConfirmada/CompraConfirmadaPage'
import HomePage from '@/pages/Home/HomePage'
import LoginPage from '@/pages/Login/LoginPage'
import MisProductosPage from '@/pages/MisProductos/MisProductosPage'
import NotFoundPage from '@/pages/NotFound/NotFoundPage'
import PerfilPage from '@/pages/Perfil/PerfilPage'
import ProductoDetallePage from '@/pages/ProductoDetalle/ProductoDetallePage'
import ProductoFormPage from '@/pages/ProductoForm/ProductoFormPage'
import RegistroPage from '@/pages/Registro/RegistroPage'
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
