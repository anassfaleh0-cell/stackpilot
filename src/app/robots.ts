import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface"
import { siteConfig } from "@/lib/constants"

const disallowedPaths = ["/api/", "/admin/", "/dashboard", "/search", "/_global-error"]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "GPTBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "GoogleOther",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "CCBot",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "Bytespider",
        allow: "/",
        disallow: disallowedPaths,
      },
      {
        userAgent: "meta-externalagent",
        allow: "/",
        disallow: disallowedPaths,
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
