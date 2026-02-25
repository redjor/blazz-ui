/** @type {import('next').NextConfig} */
const config = {
	transpilePackages: ["@blazz/ui"],
	typescript: {
		ignoreBuildErrors: true,
	},
}

export default config
