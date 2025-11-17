import { SERVER_URL_images } from "./lib/constants";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "back.formashop.nl",
        pathname: "/**",
      },
    ],
    domains: ["back.formashop.nl"],
  },
};

export default nextConfig;
