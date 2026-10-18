import styles from './Logo.module.css'

/** Isotipo (etiqueta de precio) + nombre del sitio. */
export default function Logo() {
  return (
    <span className={styles.logo}>
      <svg className={styles.isotipo} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
        <rect width="32" height="32" rx="8" fill="var(--color-primario)" />
        <path
          d="M8.5 10.2a1.7 1.7 0 0 1 1.7-1.7h5.6a1.7 1.7 0 0 1 1.2.5l6.9 6.9a1.7 1.7 0 0 1 0 2.4l-5.6 5.6a1.7 1.7 0 0 1-2.4 0L9 17a1.7 1.7 0 0 1-.5-1.2z"
          fill="none"
          stroke="#fff"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <circle cx="12.6" cy="12.6" r="1.6" fill="#fff" />
      </svg>
      <span className={styles.nombre}>
        Marketplace <span className={styles.institucion}>UADE</span>
      </span>
    </span>
  )
}
