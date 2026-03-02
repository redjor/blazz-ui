/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@blazz/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default config
