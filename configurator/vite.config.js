import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/configurator/dist/',
  plugins: [react(), tailwindcss()],
  server: {
    fs: {
      allow: ['..'],
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/configurator.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: (assetInfo) => {
          // Keep CSS named 'configurator.css' for frame-my-photo.html
          if (assetInfo.names?.[0]?.endsWith('.css') || assetInfo.name?.endsWith('.css')) {
            return 'assets/configurator.[ext]';
          }
          // All other assets (images, etc.) keep their original names
          // to prevent non-deterministic renaming between builds
          return 'assets/[name].[ext]';
        },
      },
    },
  },
})
