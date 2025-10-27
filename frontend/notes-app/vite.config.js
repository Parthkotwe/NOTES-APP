import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ✅ This ensures Vercel knows where your build files go
  build: {
    outDir: 'dist',
  },

  // ✅ Helpful during local dev
  server: {
    port: 5173,
  },

  // ✅ Tailwind custom theme (your colors)
  theme: {
    extend: {
      colors: {
        primary: "#2885ff",
        secondary: "#EF863E",
      },
    },
  },
})
