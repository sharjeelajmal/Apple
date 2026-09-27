import type { NextConfig } from "next";
import { imageHosts } from "./src/config/imageHosts";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageHosts.map((hostname) => ({ protocol: "https", hostname })),
  },
};

export default nextConfig;
