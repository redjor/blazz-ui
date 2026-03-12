/** @type {import('next').NextConfig} */
const config = {
	transpilePackages: ["@blazz/ui"],
	// ignoreBuildErrors enabled because examples app references Prisma generated types
	// that may not exist at build/CI time without a prior `prisma generate` step.
	// TODO: Add `prisma generate` to CI prebuild step to remove this workaround.
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
