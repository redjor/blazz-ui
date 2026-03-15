import { defineConfig } from "tsup"

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/dirty-guard-bar.tsx",
    "src/adapters/react-hook-form.ts",
  ],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom", "tailwindcss", "react-hook-form"],
  treeshake: true,
})
