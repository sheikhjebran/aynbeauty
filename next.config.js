/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure larger request body limits for file uploads
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
    // Optimize for production deployments
    optimizePackageImports: ["@heroicons/react", "lucide-react"],
  },

  // Configure output for production deployment
  output: "standalone",

  // Force all pages to be server-side rendered to avoid digest mismatches
  // This disables static page generation which causes the digest error
  staticPageGenerationTimeout: 0,

  // Prevent cache issues
  onDemandEntries: {
    maxInactiveAge: 15 * 1000,
    pagesBufferLength: 5,
  },

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
    domains: [],
    loader: "default",
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
