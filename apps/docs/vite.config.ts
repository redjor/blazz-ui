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
    alias: [
      { find: "next/link", replacement: path.resolve(__dirname, "src/compat/next-link.tsx") },
      { find: "next/image", replacement: path.resolve(__dirname, "src/compat/next-image.tsx") },
      { find: "next/navigation", replacement: path.resolve(__dirname, "src/compat/next-navigation.ts") },
      // Workspace packages — apply globally so files outside tsconfig include (e.g. packages/quick-login) resolve correctly
      { find: /^@blazz\/ui(\/.*)?$/, replacement: `${path.resolve(__dirname, "../../packages/ui/src")}$1` },
      { find: /^@blazz\/quick-login(\/.*)?$/, replacement: `${path.resolve(__dirname, "../../packages/quick-login/src")}$1` },
    ],
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
