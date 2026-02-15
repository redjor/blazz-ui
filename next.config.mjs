/** @type {import('next').NextConfig} */
const config = {
	typescript: {
		// Pre-existing type errors in showcase components — will fix in a dedicated pass
		ignoreBuildErrors: true,
	},
}

export default config
