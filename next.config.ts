import type { NextConfig } from "next";

const backendHost = new URL(
  process.env.NEXT_PUBLIC_ASSET_URL ?? "https://facerecognization.rgw-global.com",
);

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: backendHost.protocol.replace(":", "") as "http" | "https",
        hostname: backendHost.hostname,
        port: backendHost.port || undefined,
        pathname: "/storage/**",
      },
    ],
    formats: ["image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "swiper"],
  },
};

export default nextConfig;
