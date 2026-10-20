import ProductoCard from '@/components/ProductoCard/ProductoCard'
import styles from './GrillaProductos.module.css'

/** @param {{ productos: object[], imagenes: Record<number, object | null> }} props */
export default function GrillaProductos({ productos, imagenes }) {
  return (
    <ul className={styles.grilla}>
      {productos.map((producto) => (
        <li key={producto.id}>
          <ProductoCard producto={producto} imagen={imagenes[producto.id]} nivelTitulo={3} />
        </li>
      ))}
    </ul>
  )
}
