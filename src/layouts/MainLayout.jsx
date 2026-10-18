import { Outlet } from 'react-router'
import Footer from '@/components/Footer/Footer'
import MapaPantallas from '@/components/MapaPantallas/MapaPantallas'
import Navbar from '@/components/Navbar/Navbar'
import styles from './MainLayout.module.css'

// El botón "Pantallas" se ve con `npm run dev` y, en un deploy, si la variable de
// entorno VITE_MOSTRAR_PANTALLAS vale "true" (útil en los previews de Vercel).
const MOSTRAR_PANTALLAS = import.meta.env.DEV || import.meta.env.VITE_MOSTRAR_PANTALLAS === 'true'

export default function MainLayout() {
  return (
    <>
      <a href="#contenido" className="saltar-al-contenido">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="contenido" className={`contenedor ${styles.main}`}>
        <Outlet />
      </main>
      <Footer />
      {MOSTRAR_PANTALLAS && <MapaPantallas />}
    </>
  )
}
