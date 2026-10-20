import { CheckCircle2, Layers } from 'lucide-react'
import { useEffect, useState } from 'react'
import { actualizarCategoria, crearCategoria, eliminarCategoria, getCategorias } from '@/api/categorias'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import FormularioCategoria from './components/FormularioCategoria/FormularioCategoria'
import TablaCategorias from './components/TablaCategorias/TablaCategorias'
import styles from './AdminCategoriasPage.module.css'

/**
 * Administración de categorías (solo rol ADMIN): listar, crear, renombrar y eliminar.
 *
 * Endpoints:
 *   GET    /api/categorias
 *   POST   /api/categorias        { nombre }   (409 si el nombre ya existe)
 *   PUT    /api/categorias/{id}   { nombre }
 *   DELETE /api/categorias/{id}   (409 si tiene productos asociados)
 */
export default function AdminCategoriasPage() {
  const [categorias, setCategorias] = useState(null)
  const [errorCarga, setErrorCarga] = useState(null)
  const [creando, setCreando] = useState(false)
  const [ocupada, setOcupada] = useState(null) // id de la categoría que se está guardando o borrando
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    let cancelado = false // evita actualizar el estado si el usuario ya se fue de la página
    getCategorias()
      .then((datos) => {
        if (!cancelado) setCategorias(datos)
      })
      .catch((err) => {
        if (!cancelado) setErrorCarga(err.message)
      })
    return () => {
      cancelado = true
    }
  }, [])

  const empezar = () => {
    setError(null)
    setAviso(null)
  }

  const handleCrear = async (nombre) => {
    empezar()
    setCreando(true)
    try {
      const nueva = await crearCategoria(nombre)
      setCategorias((actuales) => [...actuales, nueva])
      setAviso(`Creaste la categoría ${nueva.nombre}.`)
      return true
    } catch (err) {
      setError(err.message) // ej.: ya existe una categoría con ese nombre (409)
      return false
    } finally {
      setCreando(false)
    }
  }

  const handleRenombrar = async (id, nombre) => {
    empezar()
    setOcupada(id)
    try {
      const actualizada = await actualizarCategoria(id, nombre)
      setCategorias((actuales) => actuales.map((item) => (item.id === id ? actualizada : item)))
      setAviso(`Renombraste la categoría a ${actualizada.nombre}.`)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setOcupada(null)
    }
  }

  const handleEliminar = async (id) => {
    empezar()
    setOcupada(id)
    const categoria = categorias.find((item) => item.id === id)
    try {
      await eliminarCategoria(id)
      setCategorias((actuales) => actuales.filter((item) => item.id !== id))
      setAviso(`Eliminaste la categoría ${categoria.nombre}.`)
    } catch (err) {
      // El back responde 409 si la categoría todavía tiene productos.
      setError(
        err.status === 409
          ? `No se puede eliminar ${categoria.nombre} porque tiene productos publicados.`
          : err.message,
      )
    } finally {
      setOcupada(null)
    }
  }

  return (
    <div className={styles.pagina}>
      <EncabezadoPagina
        titulo="Categorías"
        descripcion="Las categorías en las que se pueden publicar productos."
        migas={[{ texto: 'Administración' }, { texto: 'Categorías' }]}
      />

      {errorCarga ? (
        <EstadoVacio icono={Layers} titulo="No pudimos cargar las categorías" descripcion={errorCarga} />
      ) : (
        <>
          <FormularioCategoria enviando={creando} onCrear={handleCrear} />

          {error && (
            <p role="alert" className={styles.error}>
              {error}
            </p>
          )}
          <div role="status">
            {aviso && (
              <p className={styles.aviso}>
                <CheckCircle2 size={20} aria-hidden="true" />
                {aviso}
              </p>
            )}
          </div>

          {!categorias ? (
            <p className="texto-suave">Cargando categorías…</p>
          ) : categorias.length === 0 ? (
            <EstadoVacio
              icono={Layers}
              titulo="Todavía no hay categorías"
              descripcion="Creá la primera desde el formulario de arriba."
            />
          ) : (
            <section aria-labelledby="titulo-categorias">
              <h2 id="titulo-categorias" className={styles.subtitulo}>
                {categorias.length} {categorias.length === 1 ? 'categoría' : 'categorías'}
              </h2>
              <TablaCategorias
                categorias={categorias}
                ocupada={ocupada}
                onRenombrar={handleRenombrar}
                onEliminar={handleEliminar}
              />
            </section>
          )}
        </>
      )}
    </div>
  )
}
