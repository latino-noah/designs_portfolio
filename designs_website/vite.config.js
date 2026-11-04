import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  // Allow GitHub Codespaces forwarded URLs (*.app.github.dev)
  server: { host: true, allowedHosts: ['.app.github.dev'] },
  preview: { host: true, allowedHosts: ['.app.github.dev'] },
  build: {
    rollupOptions: {
      // Two pages: the portfolio (/) and the Hire me page (/hire/)
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        hire: resolve(import.meta.dirname, 'hire/index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
        },
      },
    },
  },
});
