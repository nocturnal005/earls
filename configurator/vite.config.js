import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/configurator/dist/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/configurator-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/configurator-[hash].[ext]',
      },
    },
  },
})
