/** @type {import('next').NextConfig} */
const config = {
	transpilePackages: ["@blazz/ui"],
	typescript: {
		ignoreBuildErrors: true,
	},
	redirects: async () => [
		{
			source: "/",
			destination: "/examples/crm/dashboard",
			permanent: false,
		},
	],
}

export default config
