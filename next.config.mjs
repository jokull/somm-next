/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source:
          "/:vendor(kaffihusvesturbaejar|raeturogvin|berjamor|baunir|akkurat|vinbondinn|slovakiskt-vin|le-caviste|a-fly-fishing-club|annad)",
        destination: "/birgjar/:vendor",
        permanent: true,
      },
      {
        source:
          "/:vendor(kaffihusvesturbaejar|raeturogvin|berjamor|baunir|akkurat|vinbondinn|slovakiskt-vin|le-caviste|a-fly-fishing-club|annad)/:path*",
        destination: "/birgjar/:vendor/:path*",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
};

export default nextConfig;
