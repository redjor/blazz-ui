/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  images: { unoptimized: true },
  typescript: { ignoreBuildErrors: true },
  transpilePackages: ["@blazz/ui", "@blazz/pro", "@blazz/tabs"],
}

export default config
