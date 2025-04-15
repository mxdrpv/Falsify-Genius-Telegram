import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',  // указываем, что index.html лежит в public
  build: {
    outDir: 'dist',  // куда будут собраны файлы
	rollupOptions: {
		input: path.resolve(__dirname, 'public/index.html'),  // Указываем точку входа
    },
  },
})
