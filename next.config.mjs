const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'images.unsplash.com',
      'www.tiktikshop.in',
      'tiktikshop.in',
      'cdn.tiktikshop.in',
      'api.tiktikshop.in'
    ],
    unoptimized: true
  }
}

export default nextConfig
