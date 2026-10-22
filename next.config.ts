import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Security: フレームワーク情報を返す X-Powered-By ヘッダーを無効化
  poweredByHeader: false,
  images:{
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
    ],
  },
  // Security: クリックジャッキング・MIMEスニッフィング対策等の基本的なセキュリティヘッダーを付与
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
