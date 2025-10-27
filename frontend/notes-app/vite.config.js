import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // ✅ correct for preview/build to avoid 404s
  theme: {
    extend: {
      colors: {
        primary: "#2885ff",
        secondary: "#EF863E",
      },
    },
  },
})
