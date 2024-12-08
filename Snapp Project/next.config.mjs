/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  trailingSlash: true
};

export default nextConfig;