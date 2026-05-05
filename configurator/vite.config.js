import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/configurator/dist/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/configurator.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/configurator.[ext]',
      },
    },
  },
})
