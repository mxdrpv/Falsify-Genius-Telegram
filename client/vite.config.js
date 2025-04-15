import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: path.resolve(__dirname, 'client/public/index.html'),
    },
  },
})
