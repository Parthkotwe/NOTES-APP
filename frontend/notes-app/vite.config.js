import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './', // important for correct asset paths in preview/build
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  theme: {
    extend: {
      colors: {
        primary: "#2885ff",
        secondary: "#EF863E",
      },
    },
  },
})

