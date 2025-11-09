import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './JavaScript'),
      '@components': path.resolve(__dirname, './JavaScript/components'),
      '@views': path.resolve(__dirname, './JavaScript/views'),
      '@router': path.resolve(__dirname, './JavaScript/router'),
    },
  },
});
