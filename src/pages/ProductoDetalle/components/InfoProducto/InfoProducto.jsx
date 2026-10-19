import styles from './InfoProducto.module.css'

/**
 * Descripción del producto y su categoría.
 *
 * @param {object} props
 * @param {{ descripcion: string, categoriaId: number }} props.producto
 * @param {{ id: number, nombre: string } | null} [props.categoria]
 */
export default function InfoProducto({ producto, categoria }) {
  return (
    <section className={styles.info}>
      <h2 className={styles.titulo}>Descripción</h2>
      <p className={styles.descripcion}>{producto.descripcion}</p>

      {categoria && <p className={styles.categoria}>Categoría: {categoria.nombre}</p>}
    </section>
  )
}
