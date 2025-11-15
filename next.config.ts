import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "allureagencys.com",
        port: "",
        pathname: "/**",
      },
      // Allow images served from the production portal storage
      {
        protocol: "https",
        hostname: "allureportal.sawatech.ae",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
