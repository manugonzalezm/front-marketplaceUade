import { Moon, Sun } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { alternarTema } from '@/store/slices/preferenciasSlice'
import styles from './BotonTema.module.css'

/**
 * Botón del header que cambia entre tema claro y oscuro. La elección queda en
 * store.preferencias y se guarda en localStorage (es un dato no sensible), así
 * se mantiene al recargar o al volver otro día.
 */
export default function BotonTema() {
  const dispatch = useDispatch()
  const esOscuro = useSelector((store) => store.preferencias.tema === 'oscuro')
  const Icono = esOscuro ? Sun : Moon

  return (
    <button
      type="button"
      className={styles.boton}
      onClick={() => dispatch(alternarTema())}
      aria-pressed={esOscuro}
      title={esOscuro ? 'Usar tema claro' : 'Usar tema oscuro'}
    >
      <Icono size={22} aria-hidden="true" />
      <span className="solo-lectores">Tema oscuro</span>
    </button>
  )
}
