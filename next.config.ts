// 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // ⚠️ Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Also ignore ESLint errors during builds if you have any
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig