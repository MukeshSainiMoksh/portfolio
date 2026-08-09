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

// When the backend stores uploads in S3/R2 the image URLs point at the bucket,
// not the API, so that host has to be allowed too. Unset for local disk storage.
const rawMediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL?.trim();
let mediaUrl: URL | null = null;
if (rawMediaUrl) {
  try {
    mediaUrl = new URL(rawMediaUrl);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_MEDIA_URL must be an absolute URL like https://media.example.com — got "${rawMediaUrl}"`
    );
  }
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
      ...(mediaUrl
        ? [
            {
              protocol: mediaUrl.protocol.replace(":", "") as "http" | "https",
              hostname: mediaUrl.hostname,
              port: mediaUrl.port,
              pathname: "/**",
            },
          ]
        : []),
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // admin dashboard must never be framed (clickjacking on delete actions)
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
    ];
  },
};

export default nextConfig;
