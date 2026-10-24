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
  // OpenNext Cloudflare adapts Next.js standalone build output.
  output: "standalone",
  // The content registry reads committed JSON at runtime. Explicitly trace these
  // data files into Next's server output so Cloudflare Workers can resolve review,
  // comparison, guide and sitemap records after deployment.
  outputFileTracingIncludes: {
    "/*": [
      "./content/**/*.json",
      "./src/lib/entities/**/*.json",
      "./src/data/**/*.json",
      "./noindex-list.json",
      "./public/**/*.json",
    ],
  },
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
    // Normalize legacy singular content routes to their current canonical collections.
    { source: "/review/:slug", destination: "/reviews/:slug", permanent: true },
    { source: "/comparison/:slug", destination: "/comparisons/:slug", permanent: true },
    { source: "/rss.xml/feed", destination: "/rss.xml", permanent: true },
    { source: "/guide/:slug", destination: "/guides/:slug", permanent: true },
    { source: "/alternative/:slug", destination: "/alternatives/:slug", permanent: true },
    { source: "/industry/:slug", destination: "/industries/:slug", permanent: true },
    { source: "/use-case/:slug", destination: "/use-cases/:slug", permanent: true },
    { source: "/hub/:slug", destination: "/hubs/:slug", permanent: true },
    { source: "/statistic/:slug", destination: "/statistics/:slug", permanent: true },
    { source: "/tool/:slug", destination: "/tools/:slug", permanent: true },
    // Keep the duplicate reverse-order comparison URL useful without competing with the canonical page.
    // Preserve the former privacy-policy URL as a permanent alias for the current policy page.
    {
      source: "/privacy-policy",
      destination: "/privacy",
      permanent: true,
    },
    // Legacy plural route names surfaced in Search Console. The singular routes
    // and matching content records exist in this repository.
    {
      // Legacy collection roots and nested paths both need permanent redirects.
      source: "/blogs",
      destination: "/blog",
      permanent: true,
    },
    {
      source: "/blogs/:slug",
      destination: "/blog/:slug",
      permanent: true,
    },
    {
      source: "/glossarys",
      destination: "/glossary",
      permanent: true,
    },
    {
      source: "/glossarys/:slug",
      destination: "/glossary/:slug",
      permanent: true,
    },
    {
      source: "/bests",
      destination: "/best",
      permanent: true,
    },
    // GSC surfaced a legacy SEO tools slug whose canonical record is best-seo-tools.
    // Redirect both singular and plural variants to the real published page.
    {
      source: "/best/seo-tools",
      destination: "/best/best-seo-tools",
      permanent: true,
    },
    {
      source: "/bests/seo-tools",
      destination: "/best/best-seo-tools",
      permanent: true,
    },
    {
      // Preserve legacy links to the project-management shortlist and buyer playbook after their canonical content routes changed.
      source: "/best/project-management-software",
      destination: "/best/best-project-management-software",
      permanent: true,
    },
    {
      source: "/guides/software-evaluation-playbook-2026",
      destination: "/blog/software-evaluation-playbook-2026",
      permanent: true,
    },
    {
      source: "/guides/software-evaluation-playbook",
      destination: "/blog/software-evaluation-playbook-2026",
      permanent: true,
    },
    // The legacy startup productivity shortlist is intentionally unpublished because its scores,
    // prices, and methodology claims are unverified. Consolidate it on the live productivity guide.
    {
      source: "/best/best-productivity-startups",
      destination: "/best/best-productivity-tools",
      permanent: true,
    },
    {
      source: "/bests/best-productivity-startups",
      destination: "/best/best-productivity-tools",
      permanent: true,
    },
    {
      source: "/bests/:slug",
      destination: "/best/:slug",
      permanent: true,
    },
    // Consolidate the intentionally unpublished, unverified Grammarly alternatives draft
    // onto the real, published Grammarly review rather than serving a dead-end 404.
    {
      source: "/alternatives/clickup-alternatives",
      destination: "/reviews/clickup",
      permanent: true,
    },
    {
      source: "/alternatives/grammarly-alternatives",
      destination: "/reviews/grammarly",
      permanent: true,
    },
    // Retire legacy individual-author URLs that no longer have matching public
    // author profiles; consolidate them on the current, transparent editorial team page.
    {
      source: "/authors/sarah-chen",
      destination: "/authors/pilotstack-team",
      permanent: true,
    },
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
    {
      // Recover legacy links to the prior Acuity Scheduling slug and consolidate on the published canonical review.
      source: "/reviews/acuity-scheduling",
      destination: "/reviews/acuity",
      permanent: true,
    },
    {
      // These legacy slugs refer to products or features already covered by canonical review pages.
      source: "/reviews/affinity-designer",
      destination: "/reviews/affinity",
      permanent: true,
    },
    {
      source: "/reviews/quickbooks-self-employed",
      destination: "/reviews/quickbooks",
      permanent: true,
    },
    {
      source: "/reviews/slack-huddles",
      destination: "/reviews/slack",
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
