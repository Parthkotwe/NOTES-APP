import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  theme:{
    extends:{
      colors:{
        primary: "#2885ff",
        secondary: "#EF863E",
      }
    }
  }
})
