import { Hammer } from 'lucide-react'
import { useParams } from 'react-router'
import EncabezadoPagina from '@/components/EncabezadoPagina/EncabezadoPagina'
import EstadoVacio from '@/components/EstadoVacio/EstadoVacio'
import { PATHS } from '@/routes/paths'

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
 *
 * Componentes sugeridos: FormularioProducto, CargaImagenes.
 */
export default function ProductoFormPage() {
  const { id } = useParams()
  const esEdicion = Boolean(id)

  return (
    <>
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
      <EstadoVacio
        icono={Hammer}
        titulo="Pantalla en desarrollo"
        descripcion="Acá va el formulario con nombre, descripción, precio, stock, categoría y fotos del producto."
      />
    </>
  )
}
