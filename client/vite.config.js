import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist',  // Сборка в корень проекта
    emptyOutDir: true,
  },
  base: '/',  // Важно для Telegram Mini App
<<<<<<< HEAD
});
=======
});
>>>>>>> 10b5ea9bb8ae21da3a88c94791126aac51d0f3c3
