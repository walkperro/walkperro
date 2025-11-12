/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: "/b/:code*", destination: "https://payhip.com/b/:code*" }];
  },
};
export default nextConfig;
