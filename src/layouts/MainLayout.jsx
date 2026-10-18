import { Outlet } from 'react-router'
import Navbar from '../components/Navbar/Navbar'
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
    </>
  )
}
