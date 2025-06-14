import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  root: './',
  base: '/posture-diagnosis/',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  },
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ]
    }
  },
  server: {
    port: 8000,
    host: '0.0.0.0', // Docker対応
    watch: {
      usePolling: true // Dockerファイルシステム監視
    }
  },
  preview: {
    port: 4173,
    host: '0.0.0.0' // Docker対応
  }
});