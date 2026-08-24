import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Served from the domain root. lib/asset.ts and App.tsx's router basename
  // both read this through BASE_URL, so this line is the only place that
  // knows — moving the site again is a one-line change.
  base: '/',
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
        //
        // The geo test must run FIRST and must name packages explicitly. d3 is
        // not map-only: recharts reaches d3-array/scale/shape/time through
        // victory-vendor, so a blanket /d3-/ rule pulls those into the geo chunk
        // and makes it a dependency of every chart on the page — which silently
        // defeats lazy-loading the map, since the chunk is needed either way.
        // Only these are reachable from react-simple-maps alone.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // React must be pinned to its own chunk. react-simple-maps reaches it
          // through require(), and Vite's CJS interop makes that a distinct
          // module from the one app code imports — which Rollup is then free to
          // park inside the lazy geo chunk. Every component needs React, so that
          // chunk would load eagerly and silently undo the lazy boundary.
          if (/\/node_modules\/(react|react-dom|scheduler|react-is|object-assign|prop-types)\//.test(id)) {
            return 'react';
          }
          if (
            /\/(react-simple-maps|d3-geo|d3-zoom|d3-drag|d3-selection|d3-transition|d3-dispatch|topojson-client|delaunator|robust-predicates)\//.test(id)
          ) {
            return 'charts-geo';
          }
          if (
            id.includes('/recharts/') ||
            id.includes('/victory-vendor/') ||
            id.includes('/decimal.js-light/') ||
            id.includes('/d3-') ||
            id.includes('/internmap/')
          ) {
            return 'recharts';
          }
        },
      },
    },
  },
});
