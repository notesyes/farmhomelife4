/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Output in standalone mode for better compatibility with various hosting platforms
  output: 'standalone',
};

export default nextConfig;
