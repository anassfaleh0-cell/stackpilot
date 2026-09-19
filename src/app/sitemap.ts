import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface"
import { siteConfig, categories, toolPages, editorialLinks } from "@/lib/constants"
import {
  getAllReviews, getAllComparisons, getAllGuides, getAllGlossaryTerms, getAllBlogPosts,
  getAllAlternatives, getAllUseCases, getAllIndustries, getAllResearch, getAllStatistics,
  getAllBest, getAllHubs,
} from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"

function isQuality(slug: string, dir: string): boolean {
  return !isNoindexed(dir, slug)
}

const staticPages = [
  { url: siteConfig.url, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
  { url: `${siteConfig.url}/reviews`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
  { url: `${siteConfig.url}/comparisons`, lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
  { url: `${siteConfig.url}/guides`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  { url: `${siteConfig.url}/blog`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  { url: `${siteConfig.url}/glossary`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 },
  { url: `${siteConfig.url}/tools`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  { url: `${siteConfig.url}/statistics`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  { url: `${siteConfig.url}/research`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  { url: `${siteConfig.url}/alternatives`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  { url: `${siteConfig.url}/use-cases`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  { url: `${siteConfig.url}/industries`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  { url: `${siteConfig.url}/best`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
  { url: `${siteConfig.url}/hubs`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
  { url: `${siteConfig.url}/about`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  { url: `${siteConfig.url}/team`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
  { url: `${siteConfig.url}/contact`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  { url: `${siteConfig.url}/privacy`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  { url: `${siteConfig.url}/terms`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  { url: `${siteConfig.url}/press`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.4 },
  { url: `${siteConfig.url}/brand-assets`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  { url: `${siteConfig.url}/media-kit`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  { url: `${siteConfig.url}/cookies`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  { url: `${siteConfig.url}/sitemap-html`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.5 },
  { url: `${siteConfig.url}/methodology`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  { url: `${siteConfig.url}/dmca`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.2 },
  ...editorialLinks.map((l) => ({
    url: `${siteConfig.url}${l.href}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  })),
]

const authorSlugs = ["pilotstack-team"]

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticPages,
    { url: `${siteConfig.url}/rss.xml`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.3 },
    ...authorSlugs.map((slug) => ({
      url: `${siteConfig.url}/authors/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...categories.map((cat) => ({
      url: `${siteConfig.url}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Only include high-quality reviews
    ...getAllReviews().filter((r) => isQuality(r.slug, "reviews")).map((r) => ({
      url: `${siteConfig.url}/reviews/${r.slug}`,
      lastModified: new Date(r.lastReviewed),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Only include high-quality comparisons
    ...getAllComparisons().filter((c) => isQuality(c.slug, "comparisons")).map((c) => ({
      url: `${siteConfig.url}/comparisons/${c.slug}`,
      lastModified: new Date(c.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getAllGuides().map((g) => ({
      url: `${siteConfig.url}/guides/${g.slug}`,
      lastModified: new Date(g.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getAllBlogPosts().map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Only include high-quality glossary terms
    ...getAllGlossaryTerms().filter((t) => isQuality(t.slug, "glossary")).map((t) => ({
      url: `${siteConfig.url}/glossary/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    // Only include high-quality alternatives
    ...getAllAlternatives().filter((a) => isQuality(a.slug, "alternatives")).map((a) => ({
      url: `${siteConfig.url}/alternatives/${a.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getAllUseCases().map((u) => ({
      url: `${siteConfig.url}/use-cases/${u.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getAllIndustries().map((i) => ({
      url: `${siteConfig.url}/industries/${i.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Only include high-quality best lists
    ...getAllBest().filter((b) => isQuality(b.slug, "best")).map((b) => ({
      url: `${siteConfig.url}/best/${b.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllHubs().map((h) => ({
      url: `${siteConfig.url}/hubs/${h.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...getAllResearch().map((r) => ({
      url: `${siteConfig.url}/research/${r.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Only include high-quality statistics
    ...getAllStatistics().filter((s) => isQuality(s.slug, "statistics")).map((s) => ({
      url: `${siteConfig.url}/statistics/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...toolPages.map((t) => ({
      url: `${siteConfig.url}/tools/${t.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ]
}
