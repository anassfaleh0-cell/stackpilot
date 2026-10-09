import type { MetadataRoute } from "next/dist/lib/metadata/types/metadata-interface"
import { siteConfig, categories, toolPages, editorialLinks } from "@/lib/constants"
import {
  getAllReviews, getAllComparisons, getAllGuides, getAllGlossaryTerms, getAllBlogPosts,
  getAllAlternatives, getAllUseCases, getAllIndustries, getAllResearch, getAllStatistics,
  getAllBest, getAllHubs,
} from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import { PUBLIC_AUTHOR_SLUGS } from "@/lib/authors"
import { getSitemapLastModified } from "@/lib/content/sitemap-date"

function isQuality(slug: string, dir: string): boolean {
  return !isNoindexed(dir, slug)
}

const staticPages: MetadataRoute.Sitemap = [
  { url: siteConfig.url, changeFrequency: "daily", priority: 1.0 },
  { url: `${siteConfig.url}/reviews`, changeFrequency: "daily", priority: 0.9 },
  { url: `${siteConfig.url}/comparisons`, changeFrequency: "daily", priority: 0.9 },
  { url: `${siteConfig.url}/guides`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteConfig.url}/blog`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/glossary`, changeFrequency: "weekly", priority: 0.6 },
  { url: `${siteConfig.url}/tools`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/statistics`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteConfig.url}/research`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/alternatives`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/use-cases`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/industries`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/best`, changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteConfig.url}/hubs`, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/about`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${siteConfig.url}/team`, changeFrequency: "monthly", priority: 0.4 },
  { url: `${siteConfig.url}/contact`, changeFrequency: "monthly", priority: 0.3 },
  { url: `${siteConfig.url}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${siteConfig.url}/terms`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${siteConfig.url}/press`, changeFrequency: "monthly", priority: 0.4 },
  { url: `${siteConfig.url}/brand-assets`, changeFrequency: "monthly", priority: 0.3 },
  { url: `${siteConfig.url}/media-kit`, changeFrequency: "monthly", priority: 0.3 },
  { url: `${siteConfig.url}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  { url: `${siteConfig.url}/sitemap-html`, changeFrequency: "weekly", priority: 0.5 },
  { url: `${siteConfig.url}/methodology`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${siteConfig.url}/dmca`, changeFrequency: "yearly", priority: 0.2 },
  ...editorialLinks.map((l) => ({
    url: `${siteConfig.url}${l.href}`,
    changeFrequency: "monthly" as const,
    priority: 0.4,
  })),
]

export default function sitemap(): MetadataRoute.Sitemap {
  // Derive actual lastModified dates from content for content pages
  const reviews = getAllReviews().filter((r) => isQuality(r.slug, "reviews"))
  const comparisons = getAllComparisons().filter((c) => isQuality(c.slug, "comparisons"))
  const guides = getAllGuides().filter((g) => isQuality(g.slug, "guides"))
  const blogPosts = getAllBlogPosts().filter((p) => isQuality(p.slug, "blog"))
  const glossary = getAllGlossaryTerms().filter((t) => isQuality(t.slug, "glossary"))
  const alternatives = getAllAlternatives().filter((a) => isQuality(a.slug, "alternatives"))
  const useCases = getAllUseCases().filter((u) => isQuality(u.slug, "use-cases"))
  const industries = getAllIndustries().filter((i) => isQuality(i.slug, "industries"))
  const best = getAllBest().filter((b) => isQuality(b.slug, "best"))
  const hubs = getAllHubs().filter((h) => isQuality(h.slug, "hubs"))
  const research = getAllResearch().filter((r) => isQuality(r.slug, "research"))
  const statistics = getAllStatistics().filter((s) => isQuality(s.slug, "statistics"))

  const entries: MetadataRoute.Sitemap = [
    ...staticPages,
    { url: `${siteConfig.url}/rss.xml`, changeFrequency: "weekly", priority: 0.3 },
    ...PUBLIC_AUTHOR_SLUGS.map((slug) => ({
      url: `${siteConfig.url}/authors/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...categories.map((cat) => ({
      url: `${siteConfig.url}/category/${cat.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Reviews: use contentModified as lastModified
    ...reviews.map((r) => ({
      url: `${siteConfig.url}/reviews/${r.slug}`,
      lastModified: getSitemapLastModified(r.contentModified),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Comparisons: use lastUpdated as lastModified
    ...comparisons.map((c) => ({
      url: `${siteConfig.url}/comparisons/${c.slug}`,
      lastModified: getSitemapLastModified(c.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Guides: use lastUpdated as lastModified
    ...guides.map((g) => ({
      url: `${siteConfig.url}/guides/${g.slug}`,
      lastModified: getSitemapLastModified(g.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Blog: use publishedAt as lastModified
    ...blogPosts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: getSitemapLastModified(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Glossary: use a source date when available; otherwise omit lastModified
    ...glossary.map((t) => ({
      url: `${siteConfig.url}/glossary/${t.slug}`,
      lastModified: getSitemapLastModified("lastUpdated" in t ? (t as { lastUpdated?: string }).lastUpdated : undefined),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    // Alternatives: use lastUpdated if available
    ...alternatives.map((a) => ({
      url: `${siteConfig.url}/alternatives/${a.slug}`,
      lastModified: getSitemapLastModified("lastUpdated" in a ? (a as { lastUpdated?: string }).lastUpdated : undefined),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Use cases: use lastUpdated if available
    ...useCases.map((u) => ({
      url: `${siteConfig.url}/use-cases/${u.slug}`,
      lastModified: getSitemapLastModified("lastUpdated" in u ? (u as { lastUpdated?: string }).lastUpdated : undefined),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Industries: use lastUpdated if available
    ...industries.map((i) => ({
      url: `${siteConfig.url}/industries/${i.slug}`,
      lastModified: getSitemapLastModified("lastUpdated" in i ? (i as { lastUpdated?: string }).lastUpdated : undefined),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Best lists: use lastUpdated if available
    ...best.map((b) => ({
      url: `${siteConfig.url}/best/${b.slug}`,
      lastModified: getSitemapLastModified("lastUpdated" in b ? (b as { lastUpdated?: string }).lastUpdated : undefined),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Hubs: use lastUpdated if available
    ...hubs.map((h) => ({
      url: `${siteConfig.url}/hubs/${h.slug}`,
      lastModified: getSitemapLastModified("lastUpdated" in h ? (h as { lastUpdated?: string }).lastUpdated : undefined),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Research: use publishedAt or updatedAt
    ...research.map((r) => ({
      url: `${siteConfig.url}/research/${r.slug}`,
      lastModified: getSitemapLastModified(r.publishedAt || r.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Statistics: use lastUpdated if available
    ...statistics.map((s) => ({
      url: `${siteConfig.url}/statistics/${s.slug}`,
      lastModified: getSitemapLastModified("lastUpdated" in s ? (s as { lastUpdated?: string }).lastUpdated : undefined),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Tool pages have no authoritative per-page modification date, so omit lastModified.
    ...toolPages.map((t) => ({
      url: `${siteConfig.url}/tools/${t.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ]

  const seen = new Set<string>()
  return entries.filter((entry) => {
    if (seen.has(entry.url)) return false
    seen.add(entry.url)
    return true
  })
}
