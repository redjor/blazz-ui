/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@blazz/ui", "@blazz/pro"],
}

export default config
