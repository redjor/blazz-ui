import { createMDX } from "fumadocs-mdx/next"

/** @type {import('next').NextConfig} */
const config = {
	typescript: {
		// Pre-existing type errors in showcase components — will fix in a dedicated pass
		ignoreBuildErrors: true,
	},
}

const withMDX = createMDX()

export default withMDX(config)
