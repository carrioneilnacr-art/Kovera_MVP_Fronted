import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Todas las llamadas a /api/* van al backend NestJS (sin CORS)
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Imágenes estáticas
      '/static': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // WebSockets
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
