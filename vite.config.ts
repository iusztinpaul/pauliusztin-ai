import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        // Split the heavy, media-kit-only charting libs into their own vendor
        // chunks so the route chunk stays small, the libs cache independently of
        // app code, and no single chunk trips the 500 kB warning.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('/recharts/') || id.includes('/victory-vendor/') || id.includes('/decimal.js-light/')) {
            return 'recharts';
          }
          if (
            id.includes('/react-simple-maps/') ||
            id.includes('/d3-') ||
            id.includes('/topojson') ||
            id.includes('/internmap/') ||
            id.includes('/delaunator/') ||
            id.includes('/robust-predicates/')
          ) {
            return 'charts-geo';
          }
        },
      },
    },
  },
});
