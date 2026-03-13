import { defineConfig } from "tsup"

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	sourcemap: true,
	clean: true,
	external: ["react", "react-dom", "next", "tailwindcss"],
	treeshake: true,
	define: {
		"process.env.BLAZZ_LICENSE_SECRET": JSON.stringify(
			process.env.BLAZZ_LICENSE_SECRET || "__BLAZZ_DEV__"
		),
	},
})
