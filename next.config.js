
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: '/api/:path*'
//       }
//     ];
//   }
// };

// export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/api/:path*",
      },
    ];
  },
};

export default nextConfig; // ✅ ESM export

