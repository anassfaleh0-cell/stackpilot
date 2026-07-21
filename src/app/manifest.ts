import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface"
import { siteConfig } from "@/lib/constants"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "minimal-ui", "browser"],
    background_color: "#FFFFFF",
    theme_color: "#6366F1",
    categories: ["technology", "business", "software"],
    scope: "/",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  }
}
