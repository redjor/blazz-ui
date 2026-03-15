import { defineConfig } from "tsup"

export default defineConfig({
	entry: [
		"src/index.ts",
		"src/components/blocks/*/index.ts",
		"src/components/ai/*/index.ts",
	],
	format: ["esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	external: ["react", "react-dom", "next", "tailwindcss", "@blazz/ui"],
	treeshake: true,
	define: {
		"process.env.BLAZZ_LICENSE_SECRET": JSON.stringify(
			process.env.BLAZZ_LICENSE_SECRET || ""
		),
	},
})
