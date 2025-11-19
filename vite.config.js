import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  server: {
    host: true,
    port: 5173,
    strictPort: true,

    allowedHosts: [
      'all',
      'nikita-unelemental-nonconjugally.ngrok-free.dev'
    ],

    cors: true
  },

  build: { 
    outDir: 'dist' 
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './JavaScript'),
      '@components': path.resolve(__dirname, './JavaScript/components'),
      '@views': path.resolve(__dirname, './JavaScript/views'),
      '@router': path.resolve(__dirname, './JavaScript/router'),
      '@controllers': path.resolve(__dirname, './JavaScript/controllers'),
      '@api': path.resolve(__dirname, './JavaScript/api'),
    },
  },
});
