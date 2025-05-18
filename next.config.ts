// // 
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,
//   typescript: {
//     // ⚠️ Dangerously allow production builds to successfully complete even if
//     // your project has type errors.
//     ignoreBuildErrors: true,
//   },
//   eslint: {
//     // ⚠️ Also ignore ESLint errors during builds if you have any
//     ignoreDuringBuilds: true,
//   },
// }

// module.exports = nextConfig
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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'workongigs.s3.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      // Wildcard pattern for any S3 bucket
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig