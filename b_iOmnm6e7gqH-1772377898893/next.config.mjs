/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    config.externals.push({
      sharp: 'commonjs sharp',
      canvas: 'commonjs canvas',
    })
    return config
  },
}

export default nextConfig
