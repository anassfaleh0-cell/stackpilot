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
      source: "/comparisons/affinity-vs-wix",
      destination: "/reviews/affinity",
      permanent: true,
    },
    {
      source: "/comparisons/dialpad-vs-loom",
      destination: "/reviews/dialpad",
      permanent: true,
    },
    {
      source: "/comparisons/adp-vs-airtable",
      destination: "/reviews/airtable",
      permanent: true,
    },
    {
      source: "/comparisons/clickup-vs-gusto",
      destination: "/reviews/clickup",
      permanent: true,
    },
    {
      source: "/comparisons/ahrefs-vs-claude",
      destination: "/reviews/ahrefs",
      permanent: true,
    },
    {
      source: "/comparisons/copy-ai-vs-heap",
      destination: "/reviews/copy-ai",
      permanent: true,
    },
    {
      source: "/comparisons/cal-com-vs-discord",
      destination: "/reviews/cal-com",
      permanent: true,
    },
    {
      source: "/comparisons/auth0-vs-bitbucket",
      destination: "/reviews/auth0",
      permanent: true,
    },
    {
      source: "/comparisons/bitwarden-vs-circleci",
      destination: "/reviews/bitwarden",
      permanent: true,
    },
    {
      source: "/comparisons/bitwarden-vs-google-analytics",
      destination: "/reviews/bitwarden",
      permanent: true,
    },
    {
      source: "/comparisons/canva-vs-cloudflare-pages",
      destination: "/reviews/canva",
      permanent: true,
    },
    {
      source: "/comparisons/cloudflare-pages-vs-crowdstrike",
      destination: "/reviews/crowdstrike",
      permanent: true,
    },
    {
      source: "/comparisons/cloudflare-pages-vs-copy-ai",
      destination: "/reviews/copy-ai",
      permanent: true,
    },
    {
      source: "/comparisons/freshbooks-vs-greenhouse",
      destination: "/reviews/freshbooks",
      permanent: true,
    },
    {
      source: "/comparisons/appwrite-vs-chatgpt",
      destination: "/reviews/chatgpt",
      permanent: true,
    },
    {
      source: "/comparisons/bitbucket-vs-claude",
      destination: "/reviews/claude",
      permanent: true,
    },
    {
      source: "/comparisons/circleci-vs-copilot",
      destination: "/reviews/copilot",
      permanent: true,
    },
    {
      source: "/comparisons/crowdstrike-vs-heap",
      destination: "/reviews/crowdstrike",
      permanent: true,
    },
    {
      source: "/comparisons/expensify-vs-fullstory",
      destination: "/reviews/expensify",
      permanent: true,
    },
    {
      source: "/comparisons/freshbooks-vs-google-analytics",
      destination: "/reviews/freshbooks",
      permanent: true,
    },
    {
      source: "/comparisons/freshdesk-vs-google-meet",
      destination: "/reviews/freshdesk",
      permanent: true,
    },
    {
      source: "/comparisons/copper-crm-vs-discord",
      destination: "/reviews/copper-crm",
      permanent: true,
    },
    {
      source: "/comparisons/gusto-vs-paddle",
      destination: "/reviews/gusto",
      permanent: true,
    },
    {
      source: "/comparisons/convertkit-vs-copilot",
      destination: "/reviews/convertkit",
      permanent: true,
    },
    {
      source: "/comparisons/activecampaign-vs-chatgpt",
      destination: "/reviews/activecampaign",
      permanent: true,
    },
    {
      source: "/comparisons/activecampaign-vs-fathom",
      destination: "/reviews/activecampaign",
      permanent: true,
    },
    {
      source: "/comparisons/adobe-xd-vs-ahrefs",
      destination: "/reviews/ahrefs",
      permanent: true,
    },
    {
      source: "/comparisons/ahrefs-vs-copper-crm",
      destination: "/reviews/copper-crm",
      permanent: true,
    },
    {
      source: "/comparisons/ahrefs-vs-fullstory",
      destination: "/reviews/ahrefs",
      permanent: true,
    },
    {
      source: "/comparisons/bigcommerce-vs-fathom",
      destination: "/reviews/bigcommerce",
      permanent: true,
    },
    {
      source: "/comparisons/chatgpt-vs-fathom",
      destination: "/reviews/chatgpt",
      permanent: true,
    },
    {
      source: "/comparisons/copilot-vs-google-analytics",
      destination: "/reviews/copilot",
      permanent: true,
    },
    {
      source: "/comparisons/convertkit-vs-google-analytics",
      destination: "/reviews/convertkit",
      permanent: true,
    },
    {
      source: "/comparisons/freshsales-vs-microsoft-teams",
      destination: "/reviews/freshsales",
      permanent: true,
    },
    {
      source: "/comparisons/heap-vs-paddle",
      destination: "/reviews/paddle",
      permanent: true,
    },
    {
      source: "/comparisons/convertkit-vs-freshdesk",
      destination: "/reviews/convertkit",
      permanent: true,
    },
    {
      source: "/comparisons/canva-vs-mailchimp",
      destination: "/reviews/mailchimp",
      permanent: true,
    },
    {
      source: "/comparisons/acuity-vs-airtable",
      destination: "/reviews/acuity",
      permanent: true,
    },
    {
      source: "/comparisons/asana-vs-cal-com",
      destination: "/reviews/asana",
      permanent: true,
    },
    {
      source: "/comparisons/basecamp-vs-calendly",
      destination: "/reviews/basecamp",
      permanent: true,
    },
    {
      source: "/comparisons/calendly-vs-google-meet",
      destination: "/reviews/calendly",
      permanent: true,
    },
    {
      source: "/comparisons/copy-ai-vs-mailchimp",
      destination: "/reviews/copy-ai",
      permanent: true,
    },
    {
      source: "/comparisons/evernote-vs-microsoft-teams",
      destination: "/reviews/evernote",
      permanent: true,
    },
    {
      source: "/comparisons/heap-vs-mailchimp",
      destination: "/reviews/heap",
      permanent: true,
    },
    {
      source: "/comparisons/claude-vs-fullstory",
      destination: "/reviews/claude",
      permanent: true,
    }
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
