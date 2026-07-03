import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://artisan-marketplace-63o8.onrender.com/api',
        changeOrigin: true,
      },
    },
  },
});
