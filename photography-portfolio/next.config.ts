import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 90 for large in-page presentation images; 75 stays for small thumbs.
    qualities: [75, 90],
  },
};

export default nextConfig;
