// Validaciones del usuario en el front, con las mismas reglas que UsuarioRequestDTO
// y LoginRequestDTO del back. Cada función devuelve el mensaje de error o '' si
// el valor es válido. Las usan Registro y Login; Mi perfil puede reutilizarlas.

const PATRON_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const SEXOS = [
  { valor: 'FEMENINO', texto: 'Femenino' },
  { valor: 'MASCULINO', texto: 'Masculino' },
  { valor: 'OTRO', texto: 'Otro' },
]

export function validarNombreUsuario(valor) {
  const texto = valor.trim()
  if (!texto) return 'Ingresá un nombre de usuario.'
  if (texto.length < 3 || texto.length > 30)
    return 'El nombre de usuario tiene que tener entre 3 y 30 caracteres.'
  return ''
}

export function validarMail(valor) {
  const texto = valor.trim()
  if (!texto) return 'Ingresá tu mail.'
  if (!PATRON_MAIL.test(texto)) return 'Revisá el mail: tiene que tener el formato nombre@dominio.com.'
  return ''
}

/**
 * @param {string} valor
 * @param {{ obligatoria?: boolean }} [opciones]  En Mi perfil la contraseña es opcional.
 */
export function validarContrasena(valor, { obligatoria = true } = {}) {
  if (!valor) return obligatoria ? 'Ingresá una contraseña.' : ''
  if (valor.length < 8 || valor.length > 72) return 'La contraseña tiene que tener entre 8 y 72 caracteres.'
  if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor))
    return 'La contraseña tiene que tener al menos una letra y un número.'
  return ''
}

export function validarObligatorio(valor, mensaje) {
  return valor.trim() ? '' : mensaje
}

/** Fecha en formato AAAA-MM-DD (lo que da <input type="date">), anterior a hoy. */
export function validarFechaNacimiento(valor) {
  if (!valor) return 'Ingresá tu fecha de nacimiento.'
  const fecha = new Date(`${valor}T00:00:00`)
  if (Number.isNaN(fecha.getTime())) return 'Revisá la fecha de nacimiento.'
  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  if (fecha >= hoy) return 'La fecha de nacimiento tiene que ser anterior a hoy.'
  return ''
}

export function validarSexo(valor) {
  return SEXOS.some((sexo) => sexo.valor === valor) ? '' : 'Elegí una opción.'
}

/** Fecha de hoy en AAAA-MM-DD, para el `max` del input de fecha de nacimiento. */
export function hoyIso() {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${hoy.getFullYear()}-${mes}-${dia}`
}
