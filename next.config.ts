/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Disable ESLint during builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during builds
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
