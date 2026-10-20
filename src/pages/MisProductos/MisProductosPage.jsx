import { CheckCircle2, Package, Plus, RefreshCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import {
  USUARIO_DEMO,
  eliminarImagen,
  eliminarProducto,
  getImagenesProducto,
  getMisProductos,
} from '@/api/misProductosDemo'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'
import ConfirmarEliminacion from './components/ConfirmarEliminacion/ConfirmarEliminacion'
import FichaMiProducto from './components/FichaMiProducto/FichaMiProducto'
import styles from './MisProductosPage.module.css'

export default function MisProductosPage() {
  // Integración pendiente: const { usuario } = useAuth(). No simular una sesión global.
  const usuario = USUARIO_DEMO
  const [productos, setProductos] = useState([])
  const [imagenes, setImagenes] = useState({})
  const [carga, setCarga] = useState({ solicitud: null, error: '' })
  const [intento, setIntento] = useState(0)
  const [pendiente, setPendiente] = useState(null)
  const [eliminando, setEliminando] = useState(false)
  const [errorEliminacion, setErrorEliminacion] = useState('')
  const [aviso, setAviso] = useState('')
  const operacionEnCurso = useRef(false)
  const montada = useRef(false)
  const tituloListado = useRef(null)
  const solicitud = `${usuario.id}:${intento}`
  const cargando = carga.solicitud !== solicitud
  const error = cargando ? '' : carga.error

  useEffect(() => {
    montada.current = true
    return () => {
      montada.current = false
    }
  }, [])

  useEffect(() => {
    let cancelado = false
    async function cargar() {
      try {
        const lista = await getMisProductos(usuario.id)
        const fotos = await Promise.all(
          lista.map(async (producto) => [producto.id, await getImagenesProducto(producto.id, usuario.id)]),
        )
        if (!cancelado) {
          setProductos(lista)
          setImagenes(Object.fromEntries(fotos))
          setCarga({ solicitud, error: '' })
        }
      } catch (err) {
        if (!cancelado)
          setCarga({
            solicitud,
            error: err.message || 'No pudimos cargar tus publicaciones. Probá de nuevo.',
          })
      }
    }
    cargar()
    return () => {
      cancelado = true
    }
  }, [usuario.id, solicitud])

  useEffect(() => {
    // El botón que abrió el diálogo puede haber desaparecido tras la eliminación.
    if (aviso) tituloListado.current?.focus()
  }, [aviso])

  const handleSolicitarEliminacion = (producto, imagen = null, indice = null) => {
    setErrorEliminacion('')
    setAviso('')
    setPendiente({ producto, imagen, indice })
  }
  const handleCancelar = () => {
    if (!operacionEnCurso.current) setPendiente(null)
  }
  const handleConfirmar = async () => {
    if (!pendiente || operacionEnCurso.current) return
    operacionEnCurso.current = true
    setEliminando(true)
    setErrorEliminacion('')
    const { producto, imagen, indice } = pendiente
    try {
      if (imagen) await eliminarImagen(producto.id, imagen.id, usuario.id)
      else await eliminarProducto(producto.id, usuario.id)
      if (!montada.current) return
      if (imagen) {
        setImagenes((actuales) => ({
          ...actuales,
          [producto.id]: actuales[producto.id].filter((foto) => foto.id !== imagen.id),
        }))
        setAviso(`Eliminaste la foto ${indice + 1} de ${producto.nombre}.`)
      } else {
        setProductos((actuales) => actuales.filter((item) => item.id !== producto.id))
        setImagenes((actuales) => {
          const siguientes = { ...actuales }
          delete siguientes[producto.id]
          return siguientes
        })
        setAviso(`Eliminaste ${producto.nombre} de tus publicaciones.`)
      }
      setPendiente(null)
    } catch (err) {
      if (montada.current) setErrorEliminacion(err.message || 'No pudimos eliminar. Probá de nuevo.')
    } finally {
      operacionEnCurso.current = false
      if (montada.current) setEliminando(false)
    }
  }
  const sinStock = productos.filter((producto) => producto.stock === 0).length

  return (
    <>
      <EncabezadoPagina
        titulo="Mis productos"
        descripcion="Todo lo que publicaste, en un solo lugar. Editá los datos, administrá las fotos y revisá el stock."
        migas={[{ texto: 'Inicio', to: PATHS.inicio }, { texto: 'Mis productos' }]}
        acciones={
          <Link to={PATHS.productoNuevo} className="boton boton-primario">
            <Plus size={18} aria-hidden="true" />
            Publicar producto
          </Link>
        }
      />
      <aside className={styles.demo} aria-label="Modo de demostración">
        <span className={styles.etiquetaDemo}>Vista de prueba</span>
        <p>
          Publicaciones de {usuario.nombre} {usuario.apellido}. Los cambios se restablecen al recargar.
        </p>
      </aside>
      <div role="status" className={aviso ? styles.aviso : styles.sinAviso}>
        {aviso && (
          <>
            <CheckCircle2 size={20} aria-hidden="true" />
            <span>{aviso}</span>
          </>
        )}
      </div>
      <section aria-labelledby="titulo-publicaciones" aria-busy={cargando}>
        <div className={styles.resumen}>
          <h2 id="titulo-publicaciones" tabIndex={-1} ref={tituloListado}>
            Tus publicaciones
          </h2>
          {!cargando && !error && (
            <p>
              {productos.length} {productos.length === 1 ? 'publicación' : 'publicaciones'} · {sinStock} sin
              stock
            </p>
          )}
        </div>
        {cargando ? (
          <p role="status" className={styles.carga}>
            Cargando tus publicaciones…
          </p>
        ) : error ? (
          <div role="alert">
            <EstadoVacio icono={Package} titulo="No pudimos cargar tus productos" descripcion={error}>
              <button
                type="button"
                className="boton boton-secundario"
                onClick={() => setIntento((valor) => valor + 1)}
              >
                <RefreshCw size={18} aria-hidden="true" />
                Reintentar
              </button>
            </EstadoVacio>
          </div>
        ) : productos.length === 0 ? (
          <EstadoVacio
            icono={Package}
            titulo="Todavía no publicaste productos"
            descripcion="Dale una nueva oportunidad a lo que ya no usás. Publicá tu primer producto desde el botón de arriba."
          />
        ) : (
          <ul className={styles.listado}>
            {productos.map((producto) => (
              <li key={producto.id}>
                <FichaMiProducto
                  producto={producto}
                  imagenes={imagenes[producto.id] ?? []}
                  onEliminar={() => handleSolicitarEliminacion(producto)}
                  onEliminarFoto={(imagen, indice) => handleSolicitarEliminacion(producto, imagen, indice)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
      {pendiente && (
        <ConfirmarEliminacion
          titulo={pendiente.imagen ? '¿Eliminar esta foto?' : '¿Eliminar esta publicación?'}
          descripcion={
            pendiente.imagen
              ? `Vas a quitar la foto ${pendiente.indice + 1} de ${pendiente.producto.nombre}. El producto y las demás fotos se conservarán.`
              : `Vas a quitar ${pendiente.producto.nombre} y sus fotos del listado. Esta acción no se puede deshacer durante esta prueba.`
          }
          etiquetaConfirmar={pendiente.imagen ? 'Eliminar foto' : 'Eliminar producto'}
          confirmando={eliminando}
          error={errorEliminacion}
          onConfirmar={handleConfirmar}
          onCancelar={handleCancelar}
        />
      )}
    </>
  )
}
