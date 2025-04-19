import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },

  server: {
    port: 5173,           // whatever you already use
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://127.0.0.1:5000', // Flask dev server
=======
        target: 'http://127.0.0.1:8000', // Flask dev server
>>>>>>> 70a38f47271eb0b5681f30f020bd55c097e6b96c
        changeOrigin: true,
        secure: false,
        /* keep the /api prefix so the final URL is
           http://127.0.0.1:5000/api/... */
      },
    },
  },
})

