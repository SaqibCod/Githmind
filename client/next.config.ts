import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // GitHub profile photos, used for the signed-in user's avatar
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;
