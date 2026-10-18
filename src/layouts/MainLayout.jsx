import { Outlet } from 'react-router'
import Footer from '@/components/Footer/Footer'
import MapaPantallas from '@/components/MapaPantallas/MapaPantallas'
import Navbar from '@/components/Navbar/Navbar'
import styles from './MainLayout.module.css'

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
      {import.meta.env.DEV && <MapaPantallas />}
    </>
  )
}
