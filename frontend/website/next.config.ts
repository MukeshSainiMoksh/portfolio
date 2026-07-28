import type { NextConfig } from "next";

// Derive the backend host from env so production images work without code changes.
// Fail the build with a clear message instead of a raw TypeError on a bad value.
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
let apiUrl: URL;
try {
  apiUrl = new URL(rawApiUrl);
} catch {
  throw new Error(
    `NEXT_PUBLIC_API_URL must be an absolute URL like https://api.example.com — got "${rawApiUrl}"`
  );
}

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol.replace(":", "") as "http" | "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        pathname: "/uploads/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
