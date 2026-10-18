import { apiFetch } from './client'

// Ejemplo de módulo de API: una función por endpoint, sin lógica de pantalla.
// Quien haga la administración de categorías suma acá crear/actualizar/eliminar.

/** GET /api/categorias -> [{ id, nombre }] */
export const getCategorias = () => apiFetch('/categorias')

/** GET /api/categorias/{id} -> { id, nombre } */
export const getCategoria = (id) => apiFetch(`/categorias/${id}`)
