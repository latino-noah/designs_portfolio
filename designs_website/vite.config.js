import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Allow GitHub Codespaces forwarded URLs (*.app.github.dev)
  server: { host: true, allowedHosts: ['.app.github.dev'] },
  preview: { host: true, allowedHosts: ['.app.github.dev'] },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three';
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) return 'motion';
        },
      },
    },
  },
});
