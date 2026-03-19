import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts", "src/components/ui/*/index.ts", "src/components/patterns/*/index.ts"],
	format: ["esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	external: ["react", "react-dom", "next", "tailwindcss"],
	treeshake: true,
})
