import type { NextConfig } from "next";
import { SERVER_URL_images } from "./lib/constants";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
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
        hostname: "backend.valideria.com",
        port: "",
        pathname: "/storage/**",
      },
    ],
  },
};

export default nextConfig;
