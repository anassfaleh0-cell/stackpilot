import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface"
import { siteConfig } from "@/lib/constants"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/search"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
}
