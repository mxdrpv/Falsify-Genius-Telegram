import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',          // Сборка в корень проекта
    emptyOutDir: true,
  },
  base: '/',                    // Важно для корректных путей
});