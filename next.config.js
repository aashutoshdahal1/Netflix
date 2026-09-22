/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/player/:path*",
        headers: [
          {
            // Prevent iframes embedded in the player page from navigating the top frame
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self'; frame-src *;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
