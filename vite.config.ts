import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Relative base + HashRouter = the build works from any static host or subfolder (e.g. GitHub Pages).
  base: './',
  build: {
    // three.js + drei land in one ~320 kB (gzipped) chunk that only loads with the 3D views.
    chunkSizeWarningLimit: 1300,
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
