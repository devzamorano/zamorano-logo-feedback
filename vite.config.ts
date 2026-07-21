import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    host: true,
    port: process.env.WEB_PORT ? Number(process.env.WEB_PORT) : 5173,
    proxy: {
      '/api': `http://localhost:${process.env.PORT || 3001}`,
    },
  },
})
