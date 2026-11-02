/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Next.js 15 Client-Side Router Cache Optimization
  // By default Next.js 15 sets dynamic routes cache to 0 seconds, causing full server roundtrips on every click.
  // Setting staleTimes allows instant 0ms client-side page transitions when navigating between pages.
  experimental: {
    staleTimes: {
      dynamic: 180, // Keep dynamic pages in client memory for 3 minutes
      static: 300,  // Keep static pages in client memory for 5 minutes
    },
  },
};

export default nextConfig;
