import { CheckCircle2, PackageX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { generatePath, Link, useParams } from 'react-router'
import { getCategorias } from '@/api/categorias'
import {
  actualizarProducto,
  crearProducto,
  eliminarImagen,
  getProducto,
  getProductoImagenes,
  subirImagenProducto,
} from '@/api/productos'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { useAuth } from '@/hooks/useAuth'
import { PATHS } from '@/routes/paths'
import FormularioProducto from './components/FormularioProducto/FormularioProducto'
import styles from './ProductoFormPage.module.css'

/**
 * Alta y edición de producto (la misma pantalla para las dos rutas).
 * Sin :id en la URL es alta; con :id es edición.
 *
 * Endpoints:
 *   GET    /api/categorias                     (para el selector)
 *   GET    /api/productos/{id}                 (edición: datos actuales)
 *   POST   /api/productos                      { nombre, descripcion, precio, stock, categoriaId }
 *   PUT    /api/productos/{id}                 (mismo body; stock es obligatorio)
 *   GET    /api/productos/{id}/imagenes
 *   POST   /api/productos/{id}/imagenes        multipart, campo "archivo"
 *                                              (hasta 5 imágenes JPEG/PNG/WebP de 5 MB)
 *   DELETE /api/productos/{id}/imagenes/{imagenId}
 *
 * En el alta, las imágenes se suben después de crear el producto (hace falta su id).
 */
export default function ProductoFormPage() {
  const { id } = useParams()
  const esEdicion = Boolean(id)
  const { usuario } = useAuth()
  const [datos, setDatos] = useState(null) // { categorias, producto, imagenes }
  const [errorCarga, setErrorCarga] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState(null)
  const [guardado, setGuardado] = useState(null) // producto guardado: muestra la confirmación
  const [formulario, setFormulario] = useState(0) // cambia para empezar un alta nueva desde cero

  useEffect(() => {
    let cancelado = false // evita actualizar el estado si el usuario ya se fue de la página
    Promise.all([
      getCategorias(),
      esEdicion ? getProducto(id) : null,
      esEdicion ? getProductoImagenes(id) : [],
    ])
      .then(([categorias, producto, imagenes]) => {
        if (cancelado) return
        if (producto && producto.usuarioId !== usuario.id) {
          setErrorCarga('Solo podés editar tus propias publicaciones.')
          return
        }
        setDatos({ categorias, producto, imagenes })
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(err.message)
      })
    return () => {
      cancelado = true
    }
  }, [id, esEdicion, usuario.id])

  const handleSubmit = async ({ producto, archivosNuevos, imagenesQuitadas }) => {
    setEnviando(true)
    setErrorEnvio(null)
    let resultado = null
    try {
      resultado = esEdicion ? await actualizarProducto(id, producto) : await crearProducto(producto)
      // Primero se borran las fotos quitadas, así no se pasa del máximo al subir las nuevas.
      for (const imagenId of imagenesQuitadas) await eliminarImagen(resultado.id, imagenId)
      for (const archivo of archivosNuevos) await subirImagenProducto(resultado.id, archivo)
      setGuardado(resultado)
    } catch (err) {
      // Si el producto ya se guardó y falló una foto, no se reintenta el alta (se duplicaría).
      if (resultado) {
        setGuardado(resultado)
        setErrorEnvio(`El producto se guardó, pero una foto no se pudo subir: ${err.message}`)
      } else {
        setErrorEnvio(err.message)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } finally {
      setEnviando(false)
    }
  }

  const handleNuevoAlta = () => {
    setGuardado(null)
    setErrorEnvio(null)
    setFormulario((valor) => valor + 1)
  }

  const encabezado = (
    <EncabezadoPagina
      titulo={esEdicion ? 'Editar producto' : 'Publicar producto'}
      descripcion={
        esEdicion
          ? 'Actualizá los datos, las fotos o el stock disponible.'
          : 'Completá los datos y subí hasta 5 fotos de lo que querés vender.'
      }
      migas={[
        { texto: 'Mis productos', to: PATHS.misProductos },
        { texto: esEdicion ? 'Editar' : 'Publicar' },
      ]}
    />
  )

  if (errorCarga) {
    return (
      <>
        {encabezado}
        <EstadoVacio icono={PackageX} titulo="No pudimos abrir el formulario" descripcion={errorCarga}>
          <Link to={PATHS.misProductos} className="boton boton-secundario">
            Volver a mis productos
          </Link>
        </EstadoVacio>
      </>
    )
  }

  if (guardado) {
    return (
      <>
        {encabezado}
        {errorEnvio && (
          <p role="alert" className={styles.error}>
            {errorEnvio}
          </p>
        )}
        <div role="status">
          <EstadoVacio
            icono={CheckCircle2}
            titulo={esEdicion ? 'Guardaste los cambios' : '¡Publicaste tu producto!'}
            descripcion={`${guardado.nombre} ya está ${guardado.stock > 0 ? 'a la venta' : 'pausado (sin stock)'}.`}
          >
            <Link
              to={generatePath(PATHS.productoDetalle, { id: guardado.id })}
              className="boton boton-primario"
            >
              Ver publicación
            </Link>
            <Link to={PATHS.misProductos} className="boton boton-secundario">
              Ir a mis productos
            </Link>
            {!esEdicion && (
              <button type="button" className="boton boton-fantasma" onClick={handleNuevoAlta}>
                Publicar otro
              </button>
            )}
          </EstadoVacio>
        </div>
      </>
    )
  }

  return (
    <>
      {encabezado}
      <section className={styles.tarjeta} aria-label={esEdicion ? 'Editar producto' : 'Publicar producto'}>
        {errorEnvio && (
          <p role="alert" className={styles.error}>
            {errorEnvio}
          </p>
        )}
        {datos ? (
          <FormularioProducto
            key={formulario}
            categorias={datos.categorias}
            producto={datos.producto}
            imagenes={datos.imagenes}
            enviando={enviando}
            onSubmit={handleSubmit}
          />
        ) : (
          <p className="texto-suave">Cargando formulario…</p>
        )}
      </section>
    </>
  )
}
