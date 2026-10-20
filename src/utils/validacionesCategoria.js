// Validaciones de la categoría en el front, con las mismas reglas que
// CategoriaRequestDTO del back. Las usan el alta y el renombrar de Admin categorías.

export const MAX_NOMBRE_CATEGORIA = 255

/** Devuelve el mensaje de error del nombre o '' si es válido. */
export function validarNombreCategoria(valor) {
  if (!valor.trim()) return 'Escribí el nombre de la categoría.'
  return valor.length > MAX_NOMBRE_CATEGORIA ? `Usá hasta ${MAX_NOMBRE_CATEGORIA} caracteres.` : ''
}
