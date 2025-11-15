/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't export as static since we have API routes
  reactStrictMode: true,
  swcMinify: true,
  // Handle server-only dependencies like ioredis
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // For client-side builds, handle Node.js built-ins
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
      };
    }
    return config;
  },
  // Handle CORS for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ]
      }
    ]
  }
};

module.exports = nextConfig;