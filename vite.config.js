import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // '@/...' apunta a src/: import { PATHS } from '@/routes/paths'
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    // El back (Spring Boot) corre en el 8080 y no tiene CORS configurado:
    // en desarrollo todas las llamadas a /api pasan por este proxy.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
