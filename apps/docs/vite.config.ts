import path from "node:path"
import { defineConfig } from "vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

export default defineConfig({
  server: { port: 3100 },
  resolve: {
    alias: {
      "next/link": path.resolve(__dirname, "src/compat/next-link.tsx"),
      "next/image": path.resolve(__dirname, "src/compat/next-image.tsx"),
      "next/navigation": path.resolve(__dirname, "src/compat/next-navigation.ts"),
    },
  },
  plugins: [
    tailwindcss(),
    tsconfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tanstackStart({
      srcDirectory: "src",
    }),
    nitro(),
    viteReact(),
  ],
})
