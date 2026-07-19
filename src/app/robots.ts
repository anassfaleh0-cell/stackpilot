import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface"
import { siteConfig } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/"],
      },
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "OAI-SearchBot",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "ClaudeBot",
        allow: "/",
      },
      {
        userAgent: "GoogleOther",
        allow: "/",
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
