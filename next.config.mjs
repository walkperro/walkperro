/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https://*.stripe.com; " +
              "frame-src https://js.stripe.com https://checkout.stripe.com; " +
              "connect-src 'self' https://api.stripe.com https://r.stripe.com https://q.stripe.com; " +
              "font-src 'self' data:"
          }
        ]
      }
    ];
  },
};
export default nextConfig;
