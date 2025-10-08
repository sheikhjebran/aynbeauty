/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure larger request body limits for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },

  // Configure output for production deployment
  output: "standalone",

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      },
      {
        protocol: "http",
        hostname: "66.116.199.206",
        port: "3000",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Allow local uploads directory
    domains: [],
    // Specify image loader for local images
    loader: "default",
    // Unoptimized for local development/testing
    unoptimized: false,
  },
  // Custom headers for static files
  async headers() {
    return [
      {
        source: "/uploads/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
