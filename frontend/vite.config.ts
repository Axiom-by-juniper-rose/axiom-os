import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // include .js files so that JSX inside src/jsx/*.js (constants, utils) is processed correctly
  plugins: [react({ include: /\.(jsx?|tsx?)$/ })],
  server: {
    port: 8008,
  },
  build: {
    // Raise limit to account for v1 legacy bundle (axiom modules are now lazy-split)
    chunkSizeWarningLimit: 3500,
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-pdf': ['jspdf'],
        },
      },
    },
    // Minification
    minify: 'esbuild',
    sourcemap: false,
    // Target modern browsers
    target: 'es2020',
  },
})
