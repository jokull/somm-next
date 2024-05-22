/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compilerOptions: {
    skipLibCheck: true,
    noEmit: true,
  },
  experimental: {
    ppr: true,
  },
};

export default nextConfig;
