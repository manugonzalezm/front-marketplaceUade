import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router'
import CampoFormulario from '@/components/CampoFormulario/CampoFormulario'
import { PATHS } from '@/routes/paths'
import CargaImagenes from '../CargaImagenes/CargaImagenes'
import styles from './FormularioProducto.module.css'

const MAX_FOTOS = 5
const MAX_BYTES_FOTO = 5 * 1024 * 1024
const TIPOS_FOTO = ['image/jpeg', 'image/png', 'image/webp']
const MAX_CARACTERES = 255 // mismo límite que ProductoRequestDTO

/** Un validador por campo, en el orden en que aparecen (para enfocar el primero con error). */
const VALIDADORES = {
  nombre: (valor) => {
    if (!valor.trim()) return 'Ingresá el nombre del producto.'
    return valor.length > MAX_CARACTERES ? `Usá hasta ${MAX_CARACTERES} caracteres.` : ''
  },
  descripcion: (valor) => {
    if (!valor.trim()) return 'Contá cómo es el producto y en qué estado está.'
    return valor.length > MAX_CARACTERES ? `Usá hasta ${MAX_CARACTERES} caracteres.` : ''
  },
  precio: (valor) => {
    if (valor === '') return 'Ingresá el precio.'
    return Number(valor) > 0 ? '' : 'El precio tiene que ser mayor a 0.'
  },
  // En el alta pide al menos 1 unidad; al editar se puede poner 0 para pausar la publicación.
  stock: (valor, { esEdicion }) => {
    if (valor === '') return 'Ingresá cuántas unidades tenés.'
    const minimo = esEdicion ? 0 : 1
    return Number.isInteger(Number(valor)) && Number(valor) >= minimo
      ? ''
      : `El stock tiene que ser un número entero desde ${minimo}.`
  },
  categoriaId: (valor) => (valor ? '' : 'Elegí una categoría.'),
}

const aTexto = (valor) => (valor === undefined || valor === null ? '' : String(valor))

/**
 * Formulario de alta y edición de producto. Valida con las mismas reglas que
 * ProductoRequestDTO y le entrega a la vista el cuerpo listo para POST/PUT
 * /api/productos, más las fotos nuevas a subir y las existentes a borrar.
 *
 * @param {object} props
 * @param {Array<{ id: number, nombre: string }>} props.categorias
 * @param {object} [props.producto]  ProductoResponseDTO a editar; sin él es un alta.
 * @param {Array<{ id: number, nombreArchivo: string, url: string }>} [props.imagenes]  Fotos actuales.
 * @param {boolean} props.enviando
 * @param {(datos: { producto: object, archivosNuevos: File[], imagenesQuitadas: number[] }) => void} props.onSubmit
 */
export default function FormularioProducto({ categorias, producto, imagenes = [], enviando, onSubmit }) {
  const esEdicion = Boolean(producto)
  const idDescripcion = useId()
  const formRef = useRef(null)
  const [valores, setValores] = useState(() => ({
    nombre: aTexto(producto?.nombre),
    descripcion: aTexto(producto?.descripcion),
    precio: aTexto(producto?.precio),
    stock: aTexto(producto?.stock ?? 1),
    categoriaId: aTexto(producto?.categoriaId),
  }))
  const [errores, setErrores] = useState({})
  // Fotos que ya tiene el producto (con imagenId) y fotos nuevas elegidas (con archivo).
  const [fotos, setFotos] = useState(() =>
    imagenes.map((imagen) => ({
      clave: `imagen-${imagen.id}`,
      imagenId: imagen.id,
      url: imagen.url,
      nombre: imagen.nombreArchivo,
    })),
  )
  const [errorFotos, setErrorFotos] = useState('')

  // Las vistas previas de fotos nuevas usan URLs temporales: se liberan al salir de la pantalla.
  const fotosActuales = useRef(fotos)
  useEffect(() => {
    fotosActuales.current = fotos
  }, [fotos])
  useEffect(
    () => () => {
      fotosActuales.current.forEach((foto) => foto.archivo && URL.revokeObjectURL(foto.url))
    },
    [],
  )

  const validar = (campo, valor, siguientes = valores) =>
    VALIDADORES[campo](valor, { ...siguientes, esEdicion })

  const handleChange = (evento) => {
    const { name, value } = evento.target
    const siguientes = { ...valores, [name]: value }
    setValores(siguientes)
    // Mientras corrige un campo que ya tenía error, se revalida en cada tecla.
    if (errores[name])
      setErrores((anteriores) => ({ ...anteriores, [name]: validar(name, value, siguientes) }))
  }

  const handleBlur = (evento) => {
    const { name, value } = evento.target
    if (value) setErrores((anteriores) => ({ ...anteriores, [name]: validar(name, value) }))
  }

  const handleAgregarFotos = (archivos) => {
    const lugares = MAX_FOTOS - fotos.length
    const invalido = archivos.find(
      (archivo) => !TIPOS_FOTO.includes(archivo.type) || archivo.size > MAX_BYTES_FOTO,
    )
    if (invalido) {
      setErrorFotos(`"${invalido.name}" no se puede usar: tiene que ser JPG, PNG o WebP de hasta 5 MB.`)
      return
    }
    if (archivos.length > lugares) {
      setErrorFotos(`Podés agregar ${lugares === 1 ? '1 foto más' : `${lugares} fotos más`}.`)
    } else {
      setErrorFotos('')
    }
    const nuevas = archivos.slice(0, lugares).map((archivo, indice) => ({
      clave: `nueva-${Date.now()}-${indice}`,
      archivo,
      url: URL.createObjectURL(archivo),
      nombre: archivo.name,
    }))
    setFotos((anteriores) => [...anteriores, ...nuevas])
  }

  const handleQuitarFoto = (clave) => {
    const foto = fotos.find((item) => item.clave === clave)
    if (foto?.archivo) URL.revokeObjectURL(foto.url)
    setFotos((anteriores) => anteriores.filter((item) => item.clave !== clave))
    setErrorFotos('')
  }

  const handleSubmit = (evento) => {
    evento.preventDefault()
    const nuevosErrores = Object.fromEntries(
      Object.keys(VALIDADORES).map((campo) => [campo, validar(campo, valores[campo])]),
    )
    setErrores(nuevosErrores)
    const sinFotos = fotos.length === 0
    setErrorFotos(sinFotos ? 'Agregá al menos una foto del producto.' : '')

    const primerCampoConError = Object.keys(nuevosErrores).find((campo) => nuevosErrores[campo])
    if (primerCampoConError) {
      formRef.current?.elements[primerCampoConError]?.focus()
      return
    }
    if (sinFotos) return

    const idsQueQuedan = fotos.filter((foto) => foto.imagenId).map((foto) => foto.imagenId)
    onSubmit({
      producto: {
        nombre: valores.nombre.trim(),
        descripcion: valores.descripcion.trim(),
        precio: Number(valores.precio),
        stock: Number(valores.stock),
        categoriaId: Number(valores.categoriaId),
      },
      archivosNuevos: fotos.filter((foto) => foto.archivo).map((foto) => foto.archivo),
      imagenesQuitadas: imagenes.map((imagen) => imagen.id).filter((id) => !idsQueQuedan.includes(id)),
    })
  }

  /** Props comunes de cada campo: valor, error y handlers. */
  const campo = (name) => ({
    name,
    value: valores[name],
    error: errores[name],
    onChange: handleChange,
    onBlur: handleBlur,
  })

  const opcionesCategoria = categorias.map((categoria) => ({
    valor: String(categoria.id),
    texto: categoria.nombre,
  }))

  return (
    <form ref={formRef} className={styles.formulario} onSubmit={handleSubmit} noValidate>
      <CampoFormulario
        etiqueta="Nombre"
        placeholder="Ej.: Calculadora científica Casio fx-350"
        maxLength={MAX_CARACTERES}
        {...campo('nombre')}
      />

      <div className={styles.campoTexto}>
        <label htmlFor={idDescripcion}>Descripción</label>
        <textarea
          id={idDescripcion}
          rows={4}
          maxLength={MAX_CARACTERES}
          placeholder="Estado, uso, qué incluye…"
          aria-invalid={errores.descripcion ? 'true' : undefined}
          aria-describedby={`${idDescripcion}-ayuda${errores.descripcion ? ` ${idDescripcion}-error` : ''}`}
          name="descripcion"
          value={valores.descripcion}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errores.descripcion && (
          <p id={`${idDescripcion}-error`} className={styles.error}>
            {errores.descripcion}
          </p>
        )}
        <p id={`${idDescripcion}-ayuda`} className={styles.ayuda}>
          {valores.descripcion.length}/{MAX_CARACTERES} caracteres
        </p>
      </div>

      <div className={styles.columnas}>
        <CampoFormulario
          etiqueta="Precio ($)"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          {...campo('precio')}
        />
        <CampoFormulario
          etiqueta="Stock"
          type="number"
          inputMode="numeric"
          min={esEdicion ? 0 : 1}
          step="1"
          ayuda={esEdicion ? 'Con 0 la publicación queda pausada.' : undefined}
          {...campo('stock')}
        />
        <CampoFormulario etiqueta="Categoría" opciones={opcionesCategoria} {...campo('categoriaId')} />
      </div>

      <CargaImagenes
        fotos={fotos}
        maximo={MAX_FOTOS}
        error={errorFotos}
        deshabilitado={enviando}
        onAgregar={handleAgregarFotos}
        onQuitar={handleQuitarFoto}
      />

      <div className={styles.acciones}>
        <button type="submit" className="boton boton-primario" disabled={enviando}>
          {enviando ? 'Guardando…' : esEdicion ? 'Guardar cambios' : 'Publicar producto'}
        </button>
        <Link to={PATHS.misProductos} className="boton boton-fantasma">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
