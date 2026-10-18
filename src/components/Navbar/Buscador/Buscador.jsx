import { Search } from 'lucide-react'
import { createSearchParams, useNavigate, useSearchParams } from 'react-router'
import { PATHS } from '@/routes/paths'
import styles from './Buscador.module.css'

/**
 * Buscador del header. El back no tiene endpoint de búsqueda: manda al inicio
 * con ?q=texto y el inicio filtra los productos por nombre.
 */
export default function Buscador() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const busqueda = searchParams.get('q') ?? ''

  const handleSubmit = (evento) => {
    evento.preventDefault()
    const texto = new FormData(evento.currentTarget).get('q').trim()
    navigate({
      pathname: PATHS.inicio,
      search: texto ? `?${createSearchParams({ q: texto })}` : '',
    })
  }

  return (
    <form role="search" className={styles.buscador} onSubmit={handleSubmit}>
      <label htmlFor="buscador-q" className="solo-lectores">
        Buscar productos
      </label>
      <input
        // key: si cambia la búsqueda en la URL, el input se reinicia con el valor nuevo
        key={busqueda}
        id="buscador-q"
        name="q"
        type="search"
        defaultValue={busqueda}
        placeholder="Buscar productos, marcas y más"
        autoComplete="off"
        className={styles.input}
      />
      <button type="submit" className={styles.boton}>
        <Search size={20} aria-hidden="true" />
        <span className="solo-lectores">Buscar</span>
      </button>
    </form>
  )
}
