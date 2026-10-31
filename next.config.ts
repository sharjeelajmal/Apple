import type { NextConfig } from "next";
import { imageHosts } from "./src/config/imageHosts";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "14mb",
    },
  },
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https", hostname })),
  },
};

export default nextConfig;
