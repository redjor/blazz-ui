import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import viteReact from "@vitejs/plugin-react"
import { nitro } from "nitro/vite"
import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
	server: { port: 3130 },
	resolve: {
		alias: [
			{
				find: /^@blazz\/ui(\/.*)?$/,
				replacement: `${path.resolve(__dirname, "../../packages/ui/src")}$1`,
			},
			{
				find: /^@blazz\/pro(\/.*)?$/,
				replacement: `${path.resolve(__dirname, "../../packages/pro/src")}$1`,
			},
		],
	},
	plugins: [tailwindcss(), tsconfigPaths({ projects: ["./tsconfig.json"] }), tanstackStart({ srcDirectory: "src" }), nitro(), viteReact()],
})
