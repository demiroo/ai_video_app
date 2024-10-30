/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/bull-board',
        destination: '/api/bull-board',
      },
      {
        source: '/api/bull-board/:path*',
        destination: '/api/bull-board/:path*',
      },
    ];
  },
};

export default nextConfig;
