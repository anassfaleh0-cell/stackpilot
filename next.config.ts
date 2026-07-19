import type { NextConfig } from "next/dist/server/config-shared"

const monetagDomains = [
  "https://quge5.com",
  "https://*.quge5.com",
  "https://venetrue.com",
  "https://*.venetrue.com",
  "https://dolohen.com",
  "https://*.dolohen.com",
  "https://srclick.com",
  "https://*.srclick.com",
  "https://loaztee.com",
  "https://*.loaztee.com",
].join(" ")

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com ${monetagDomains}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https: https://www.google-analytics.com",
  "font-src 'self'",
  `connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com ${monetagDomains} https:`,
  `frame-src 'self' ${monetagDomains} https:`,
  "worker-src 'self' blob:",
  "child-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ")

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-DNS-Prefetch-Control", value: "on" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        { key: "Content-Security-Policy", value: csp },
      ],
    },
    {
      source: "/images/:path*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/favicon.svg",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/apple-touch-icon.png",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/robots.txt",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
      ],
    },
  ],
}

export default nextConfig
