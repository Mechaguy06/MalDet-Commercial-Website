import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  server: {
    host: process.env.FIGMA_DEV_SERVER_HOST || true,
    port: Number(process.env.PORT) || 4321,
  },
  vite: {
    plugins: [tailwindcss()],
    server: { allowedHosts: true },
  },
})
