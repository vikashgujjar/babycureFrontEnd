import type { NextConfig } from "next";

const backendHost = new URL(
  process.env.NEXT_PUBLIC_ASSET_URL ?? "http://127.0.0.1:8000",
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: backendHost.protocol.replace(":", "") as "http" | "https",
        hostname: backendHost.hostname,
        port: backendHost.port || undefined,
        pathname: "/babycure/public/storage/**",
      },
    ],
    formats: ["image/webp"],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "swiper"],
  },
};

export default nextConfig;
