import { useParams } from 'react-router'

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

  return (
    <section>
      <h1>{esEdicion ? `Editar producto ${id}` : 'Publicar producto'}</h1>
      <p className="texto-suave">Página en construcción.</p>
    </section>
  )
}
