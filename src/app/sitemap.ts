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

// Use a fixed date for policy/editorial pages that rarely change
const POLICY_DATE = "2026-01-15"
// Use current date for listing pages that update frequently
const LISTING_DATE = new Date()

const staticPages: MetadataRoute.Sitemap = [
  { url: siteConfig.url, lastModified: LISTING_DATE, changeFrequency: "daily", priority: 1.0 },
  { url: `${siteConfig.url}/reviews`, lastModified: LISTING_DATE, changeFrequency: "daily", priority: 0.9 },
  { url: `${siteConfig.url}/comparisons`, lastModified: LISTING_DATE, changeFrequency: "daily", priority: 0.9 },
  { url: `${siteConfig.url}/guides`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteConfig.url}/blog`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/glossary`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.6 },
  { url: `${siteConfig.url}/tools`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/statistics`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteConfig.url}/research`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/alternatives`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/use-cases`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/industries`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/best`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.8 },
  { url: `${siteConfig.url}/hubs`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.7 },
  { url: `${siteConfig.url}/about`, lastModified: new Date(POLICY_DATE), changeFrequency: "monthly", priority: 0.5 },
  { url: `${siteConfig.url}/team`, lastModified: new Date(POLICY_DATE), changeFrequency: "monthly", priority: 0.4 },
  { url: `${siteConfig.url}/contact`, lastModified: new Date(POLICY_DATE), changeFrequency: "monthly", priority: 0.3 },
  { url: `${siteConfig.url}/privacy`, lastModified: new Date(POLICY_DATE), changeFrequency: "yearly", priority: 0.2 },
  { url: `${siteConfig.url}/terms`, lastModified: new Date(POLICY_DATE), changeFrequency: "yearly", priority: 0.2 },
  { url: `${siteConfig.url}/press`, lastModified: new Date(POLICY_DATE), changeFrequency: "monthly", priority: 0.4 },
  { url: `${siteConfig.url}/brand-assets`, lastModified: new Date(POLICY_DATE), changeFrequency: "monthly", priority: 0.3 },
  { url: `${siteConfig.url}/media-kit`, lastModified: new Date(POLICY_DATE), changeFrequency: "monthly", priority: 0.3 },
  { url: `${siteConfig.url}/cookies`, lastModified: new Date(POLICY_DATE), changeFrequency: "yearly", priority: 0.2 },
  { url: `${siteConfig.url}/sitemap-html`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.5 },
  { url: `${siteConfig.url}/methodology`, lastModified: new Date(POLICY_DATE), changeFrequency: "monthly", priority: 0.5 },
  { url: `${siteConfig.url}/dmca`, lastModified: new Date(POLICY_DATE), changeFrequency: "yearly", priority: 0.2 },
  ...editorialLinks.map((l) => ({
    url: `${siteConfig.url}${l.href}`,
    lastModified: new Date(POLICY_DATE),
    changeFrequency: "monthly" as const,
    priority: 0.4,
  })),
]

const authorSlugs = ["sarah-chen", "marcus-rivera", "emily-nakamura"]

export default function sitemap(): MetadataRoute.Sitemap {
  // Derive actual lastModified dates from content for content pages
  const reviews = getAllReviews().filter((r) => isQuality(r.slug, "reviews"))
  const comparisons = getAllComparisons().filter((c) => isQuality(c.slug, "comparisons"))
  const guides = getAllGuides()
  const blogPosts = getAllBlogPosts()
  const glossary = getAllGlossaryTerms().filter((t) => isQuality(t.slug, "glossary"))
  const alternatives = getAllAlternatives().filter((a) => isQuality(a.slug, "alternatives"))
  const useCases = getAllUseCases()
  const industries = getAllIndustries()
  const best = getAllBest().filter((b) => isQuality(b.slug, "best"))
  const hubs = getAllHubs()
  const research = getAllResearch()
  const statistics = getAllStatistics().filter((s) => isQuality(s.slug, "statistics"))

  return [
    ...staticPages,
    { url: `${siteConfig.url}/rss.xml`, lastModified: LISTING_DATE, changeFrequency: "weekly", priority: 0.3 },
    ...authorSlugs.map((slug) => ({
      url: `${siteConfig.url}/authors/${slug}`,
      lastModified: new Date(POLICY_DATE),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
    ...categories.map((cat) => ({
      url: `${siteConfig.url}/category/${cat.slug}`,
      lastModified: LISTING_DATE,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Reviews: use lastReviewed as lastModified
    ...reviews.map((r) => ({
      url: `${siteConfig.url}/reviews/${r.slug}`,
      lastModified: new Date(r.lastReviewed),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Comparisons: use lastUpdated as lastModified
    ...comparisons.map((c) => ({
      url: `${siteConfig.url}/comparisons/${c.slug}`,
      lastModified: new Date(c.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Guides: use lastUpdated as lastModified
    ...guides.map((g) => ({
      url: `${siteConfig.url}/guides/${g.slug}`,
      lastModified: new Date(g.lastUpdated),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Blog: use publishedAt as lastModified
    ...blogPosts.map((p) => ({
      url: `${siteConfig.url}/blog/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Glossary: use lastUpdated if available, otherwise a fixed date
    ...glossary.map((t) => ({
      url: `${siteConfig.url}/glossary/${t.slug}`,
      lastModified: new Date("lastUpdated" in t ? (t as { lastUpdated?: string }).lastUpdated || POLICY_DATE : POLICY_DATE),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    // Alternatives: use lastUpdated if available
    ...alternatives.map((a) => ({
      url: `${siteConfig.url}/alternatives/${a.slug}`,
      lastModified: new Date("lastUpdated" in a ? (a as { lastUpdated?: string }).lastUpdated || LISTING_DATE : LISTING_DATE),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Use cases: use lastUpdated if available
    ...useCases.map((u) => ({
      url: `${siteConfig.url}/use-cases/${u.slug}`,
      lastModified: new Date("lastUpdated" in u ? (u as { lastUpdated?: string }).lastUpdated || LISTING_DATE : LISTING_DATE),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Industries: use lastUpdated if available
    ...industries.map((i) => ({
      url: `${siteConfig.url}/industries/${i.slug}`,
      lastModified: new Date("lastUpdated" in i ? (i as { lastUpdated?: string }).lastUpdated || LISTING_DATE : LISTING_DATE),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Best lists: use lastUpdated if available
    ...best.map((b) => ({
      url: `${siteConfig.url}/best/${b.slug}`,
      lastModified: new Date("lastUpdated" in b ? (b as { lastUpdated?: string }).lastUpdated || LISTING_DATE : LISTING_DATE),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Hubs: use lastUpdated if available
    ...hubs.map((h) => ({
      url: `${siteConfig.url}/hubs/${h.slug}`,
      lastModified: new Date("lastUpdated" in h ? (h as { lastUpdated?: string }).lastUpdated || LISTING_DATE : LISTING_DATE),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    // Research: use publishedAt or updatedAt
    ...research.map((r) => ({
      url: `${siteConfig.url}/research/${r.slug}`,
      lastModified: new Date(r.publishedAt || r.updatedAt || LISTING_DATE),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Statistics: use lastUpdated if available
    ...statistics.map((s) => ({
      url: `${siteConfig.url}/statistics/${s.slug}`,
      lastModified: new Date("lastUpdated" in s ? (s as { lastUpdated?: string }).lastUpdated || LISTING_DATE : LISTING_DATE),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    // Tool pages
    ...toolPages.map((t) => ({
      url: `${siteConfig.url}/tools/${t.slug}`,
      lastModified: LISTING_DATE,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ]
}
