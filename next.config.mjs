/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // 一時的に無効化
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
