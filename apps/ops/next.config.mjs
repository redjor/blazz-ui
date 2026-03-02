/** @type {import('next').NextConfig} */
const config = {
  images: { unoptimized: true },
  transpilePackages: ["@blazz/ui"],
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default config
