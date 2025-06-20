import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  // Add the server configuration here
  server: {
    proxy: {
      // Route API requests to the backend server
      '/api': {
        target: 'http://localhost:3000', // Your backend server address
        changeOrigin: true, // Recommended for avoiding CORS issues
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api from the path
      },
    }
  }
})