import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',  // указываем, что index.html лежит в public
  build: {
    outDir: 'dist',  // куда будут собраны файлы
  },
})
