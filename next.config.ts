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
]

const monetag = [
  "https://tzegilo.com",
  "https://*.tzegilo.com",
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
  "https://5gvci.com",
  "https://*.5gvci.com",
  "https://n6wxm.com",
  "https://*.n6wxm.com",
  "https://3nbf4.com",
  "https://*.3nbf4.com",
  "https://my.rtmark.net",
  "https://*.rtmark.net",
  "https://ldrws.com",
  "https://*.ldrws.com",
]

const scriptSrc = [...analytics, ...monetag].join(" ")
const monetagStr = monetag.join(" ")

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
  `connect-src 'self' ${scriptSrc}`,
  `frame-src 'self' ${monetagStr}`,
  `worker-src 'self' blob: ${scriptSrc}`,
  `child-src 'self' blob: ${monetagStr}`,
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
