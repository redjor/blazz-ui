/** @type {import('next').NextConfig} */
const config = {
	images: { unoptimized: true },
	transpilePackages: ["@blazz/ui", "@blazz/pro", "@blazz/tabs"],
	// ignoreBuildErrors required because convex/_generated/ is gitignored.
	// Types are generated at runtime by `npx convex dev` but don't exist at build/CI time.
	// TODO: Add `npx convex codegen` to CI prebuild step to remove this workaround.
	typescript: {
		ignoreBuildErrors: true,
	},
}

export default config
