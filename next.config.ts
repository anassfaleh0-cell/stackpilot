import type { NextConfig } from "next/dist/server/config-shared"

const analytics = [
  "https://www.googletagmanager.com",
  "https://*.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://*.google-analytics.com",
  "https://analytics.google.com",
  "https://stats.g.doubleclick.net",
  "https://www.clarity.ms",
  "https://*.clarity.ms",
  "https://c.bing.com",
  "https://static.cloudflareinsights.com",
  "https://fonts.googleapis.com",
  "https://fonts.gstatic.com",
  "https://pagead2.googlesyndication.com",
  "https://*.googlesyndication.com",
  "https://*.google.com",
  "https://ep1.adtrafficquality.google",
  "https://*.adtrafficquality.google",
  "https://csi.gstatic.com",
]

const scriptSrc = analytics.join(" ")
const workerSrc = [...analytics, "blob:"].join(" ")

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' ${scriptSrc}`,
  `script-src-elem 'self' 'unsafe-inline' ${scriptSrc}`,
  "script-src-attr 'none'",
  `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  `style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com`,
  "style-src-attr 'unsafe-inline'",
  `img-src 'self' data: blob: ${scriptSrc}`,
  `font-src 'self' https://fonts.gstatic.com`,
  `media-src 'self'`,
  `connect-src 'self' ${scriptSrc}`,
  `frame-src 'self' ${scriptSrc} https://googleads.g.doubleclick.net`,
  `worker-src 'self' ${workerSrc}`,
  "child-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "manifest-src 'self'",
].join("; ")

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  redirects: async () => [
    {
      // Consolidate the verified www hostname onto the canonical apex host.
      // Keep the full path (including nested segments) and query string intact.
      source: "/:path*",
      has: [{ type: "host", value: "www.pilotstack.online" }],
      destination: "https://pilotstack.online/:path*",
      permanent: true,
    },
    // Legacy plural route names surfaced in Search Console. The singular routes
    // and matching content records exist in this repository.
    {
      source: "/blogs/:slug",
      destination: "/blog/:slug",
      permanent: true,
    },
    {
      source: "/glossarys/:slug",
      destination: "/glossary/:slug",
      permanent: true,
    },
    {
      source: "/bests/:slug",
      destination: "/best/:slug",
      permanent: true,
    },
    // Retire legacy individual-author URLs that no longer have matching public
    // author profiles; consolidate them on the current, transparent editorial team page.
    {
      source: "/authors/priya-sharma",
      destination: "/authors/pilotstack-team",
      permanent: true,
    },
    {
      source: "/authors/sarah-mitchell",
      destination: "/authors/pilotstack-team",
      permanent: true,
    },
    {
      source: "/reviews/calndly",
      destination: "/reviews/calendly",
      permanent: true,
    },
  ],
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
        { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
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
      source: "/ads.txt",
      headers: [
        { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" },
        { key: "Content-Type", value: "text/plain" },
      ],
    },
    {
      source: "/robots.txt",
      headers: [
        { key: "Cache-Control", value: "public, max-age=86400" },
      ],
    },
    {
      source: "/:path*.svg",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/og.png",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
  ],
}

export default nextConfig
