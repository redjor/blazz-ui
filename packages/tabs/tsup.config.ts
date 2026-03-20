import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/ui/index.ts",
    "src/adapters/next/index.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "next", "tailwindcss", "lucide-react"],
  banner: { js: '"use client";' },
})
