import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),tailwindcss()],
  base: '/', // This is critical
  build: {
    outDir: 'dist',
  },
  server: {
    historyApiFallback: true,
  }
})