import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  base: "/",
  build: {
    outDir: "dist",
  },
  server: {
    host: "0.0.0.0",
    port: 5173,
    strictPort: true,
    open: true,
    proxy: {
      "/api": {
        target: "https://shareasmile-food-donation-app.onrender.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    port: 8080,
  },
  define: {
    "process.env": {},
  },
})
