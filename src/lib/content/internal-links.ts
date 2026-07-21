import { getAllReviews, getAllComparisons, getAllGuides, getAllBest, getAllAlternatives } from "./registry"
import type { ReviewContent, ComparisonContent, GuideContent, BestContent, AlternativeContent } from "@/types/content"

export interface RelatedItem {
  slug: string
  title: string
  type: "review" | "comparison" | "guide" | "best" | "alternative"
  category: string
  rating?: number
}

export function getRelatedByCategory(
  category: string,
  excludeSlug: string,
  maxPerType = 4,
): {
  reviews: RelatedItem[]
  comparisons: RelatedItem[]
  guides: RelatedItem[]
  bestPages: RelatedItem[]
  alternatives: RelatedItem[]
} {
  const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr]
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  const reviews: RelatedItem[] = shuffle(
    getAllReviews()
      .filter((r) => r.category === category && r.slug !== excludeSlug)
      .map((r) => ({ slug: r.slug, title: r.name, type: "review" as const, category: r.category, rating: r.rating })),
  ).slice(0, maxPerType)

  const comparisons: RelatedItem[] = shuffle(
    getAllComparisons()
      .filter((c) => (c.category === category || c.secondaryCategories?.includes(category)) && c.slug !== excludeSlug)
      .map((c) => ({ slug: c.slug, title: c.title, type: "comparison" as const, category: c.category })),
  ).slice(0, maxPerType)

  const guides: RelatedItem[] = shuffle(
    getAllGuides()
      .filter((g) => g.category === category && g.slug !== excludeSlug)
      .map((g) => ({ slug: g.slug, title: g.title, type: "guide" as const, category: g.category })),
  ).slice(0, maxPerType)

  const bestPages: RelatedItem[] = shuffle(
    getAllBest()
      .filter((b) => b.category === category && b.slug !== excludeSlug)
      .map((b) => ({ slug: b.slug, title: b.title, type: "best" as const, category: b.category })),
  ).slice(0, maxPerType)

  const alternatives: RelatedItem[] = shuffle(
    getAllAlternatives()
      .filter((a) => a.category === category && a.slug !== excludeSlug)
      .map((a) => ({ slug: a.slug, title: a.title, type: "alternative" as const, category: a.category })),
  ).slice(0, maxPerType)

  return { reviews, comparisons, guides, bestPages, alternatives }
}

export function getHref(item: RelatedItem): string {
  switch (item.type) {
    case "review": return `/reviews/${item.slug}`
    case "comparison": return `/comparisons/${item.slug}`
    case "guide": return `/guides/${item.slug}`
    case "best": return `/best/${item.slug}`
    case "alternative": return `/alternatives/${item.slug}`
  }
}
