import { createContext } from 'react'

/**
 * Contexto de la sesión. Vive separado de AuthContext.jsx para que ese archivo
 * exporte solo componentes (lo pide el fast refresh de Vite). No se usa directo:
 * se consume con el hook useAuth (src/hooks/useAuth.js).
 */
export const AuthContext = createContext(null)
