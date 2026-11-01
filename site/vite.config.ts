import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    // 讲解员后端走同源 /api，开发期由 vite 转发，生产交给部署层反代
    proxy: {
      '/api': { target: 'http://127.0.0.1:3000', changeOrigin: false },
      '/uploads/': { target: 'http://127.0.0.1:3000', changeOrigin: false },
    },
  },
  preview: { host: '127.0.0.1', port: 4173, strictPort: true },
})
