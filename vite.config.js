import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // El back (Spring Boot) corre en el 8080 y no tiene CORS configurado:
    // en desarrollo todas las llamadas a /api pasan por este proxy.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
