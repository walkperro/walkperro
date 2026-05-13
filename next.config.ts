import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip Vercel's Image Optimization API — Hobby tier caps it at 1k transforms/month
  // and was returning 402 in production, breaking the portfolio carousel.
  // Our portfolio webps are already pre-optimized (1600px, q82) so optimization
  // adds nothing useful here.
  images: { unoptimized: true },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
