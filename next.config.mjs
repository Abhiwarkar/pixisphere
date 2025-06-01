/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  // For running React Router DOM in Next.js environment
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;