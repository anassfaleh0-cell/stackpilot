import { getAllReviews, getAllComparisons, getAllGuides, getAllBest, getAllAlternatives, getAllUseCases, getAllHubs, getAllIndustries, getAllResearch, getAllStatistics, getAllBlogPosts, getAllGlossaryTerms, isContentAvailable } from "./registry"
import type { ReviewContent, ComparisonContent, GuideContent, BestContent, AlternativeContent } from "@/types/content"

export type RelatedType =
  | "review"
  | "comparison"
  | "guide"
  | "best"
  | "alternative"
  | "use-case"
  | "hub"
  | "industry"
  | "research"
  | "statistic"
  | "blog"
  | "glossary"

export interface RelatedItem {
  slug: string
  title: string
  type: RelatedType
  category: string
  rating?: number
}

export interface RelatedResult {
  reviews: RelatedItem[]
  comparisons: RelatedItem[]
  guides: RelatedItem[]
  bestPages: RelatedItem[]
  alternatives: RelatedItem[]
  useCases: RelatedItem[]
  hubs: RelatedItem[]
  industries: RelatedItem[]
  research: RelatedItem[]
  statistics: RelatedItem[]
  blogPosts: RelatedItem[]
  glossaryTerms: RelatedItem[]
  /** Every bucket above ordered by relevance and de-duplicated by href. */
  related: RelatedItem[]
}

// How a candidate was matched against the requested category. "direct" means the item
// carries the category itself, "audience" means one of its declared tool recommendations
// carries it, "related" means one of its declared related links resolves to content that
// carries it. Direct matches always outrank inferred ones.
type MatchKind = "direct" | "audience" | "related"

const MATCH_WEIGHT: Record<MatchKind, number> = { direct: 0, audience: 1, related: 2 }

function normalizeCategory(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/&/g, " ")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function sameCategory(left: string | undefined | null, right: string | undefined | null): boolean {
  return typeof left === "string" && typeof right === "string" &&
    normalizeCategory(left) === normalizeCategory(right)
}

// Merged-ranking weight per family. The five legacy families and the seven newer families
// are interleaved, so a strong use-case, hub or blog candidate ranks beside the legacy
// candidates instead of every new family being appended after them. Families are only used
// to order candidates that matched the requested category equally strongly: match quality
// always dominates, so a direct category match never falls behind an inferred one.
const FAMILY_WEIGHT: Record<RelatedType, number> = {
  review: 0,
  "use-case": 1,
  comparison: 2,
  hub: 3,
  guide: 4,
  industry: 5,
  best: 6,
  blog: 7,
  research: 8,
  alternative: 9,
  statistic: 10,
  glossary: 11,
}

const FAMILY_COUNT = Object.keys(FAMILY_WEIGHT).length

// Related-content is rendered by hundreds of static pages. Re-reading and re-sanitizing
// every content family for each page can exceed Next.js's 60-second static-generation
// timeout. Content is immutable during a production build, so cache the source collections
// for the lifetime of this build worker.
const relatedSourceCache = new Map<string, unknown[]>()

function getCachedRelatedSource<T>(key: string, load: () => T[]): T[] {
  const cached = relatedSourceCache.get(key)
  if (cached) return cached as T[]
  const source = load()
  relatedSourceCache.set(key, source)
  return source
}

const RELATED_FIELD_TYPE: Record<string, RelatedType> = {
  relatedGuides: "guide",
  relatedComparisons: "comparison",
  relatedPosts: "blog",
  relatedGlossary: "glossary",
  relatedTerms: "glossary",
}

interface RankedItem {
  item: RelatedItem
  match: MatchKind
  rank: number
}

interface BucketSpec<T> {
  type: RelatedType
  source: T[]
  matchOf: (entry: T) => MatchKind | null
  toItem: (entry: T) => RelatedItem | null
  compare: (a: T, b: T) => number
}

function buildBucket<T>(spec: BucketSpec<T>, excludeSlug: string, maxPerType: number): RankedItem[] {
  const candidates: { entry: T; match: MatchKind; item: RelatedItem }[] = []
  for (const entry of spec.source) {
    const match = spec.matchOf(entry)
    if (match === null) continue
    const item = spec.toItem(entry)
    if (item === null) continue
    if (item.slug === excludeSlug) continue
    if (!isContentAvailable(spec.type, item.slug)) continue
    candidates.push({ entry, match, item })
  }
  candidates.sort((a, b) => MATCH_WEIGHT[a.match] - MATCH_WEIGHT[b.match] || spec.compare(a.entry, b.entry))
  return candidates.slice(0, maxPerType).map((c, rank) => ({ item: c.item, match: c.match, rank }))
}

function hasAudienceMatch(entry: unknown, category: string): boolean {
  if (typeof entry !== "object" || entry === null) return false
  const recommendations = (entry as Record<string, unknown>).recommendations
  if (!Array.isArray(recommendations)) return false
  return recommendations.some((r) => typeof r === "object" && r !== null && sameCategory((r as Record<string, unknown>).category as string | undefined, category))
}

function hasRelatedMatch(entry: unknown, category: string, index: Map<string, string>): boolean {
  if (typeof entry !== "object" || entry === null) return false
  const record = entry as Record<string, unknown>
  for (const field of Object.keys(RELATED_FIELD_TYPE)) {
    const slugs = record[field]
    if (!Array.isArray(slugs)) continue
    const relatedType = RELATED_FIELD_TYPE[field]
    for (const slug of slugs) {
      if (typeof slug === "string" && sameCategory(index.get(`${relatedType}:${slug}`), category)) return true
    }
  }
  return false
}

function recencyOf(entry: unknown): string {
  if (typeof entry !== "object" || entry === null) return ""
  const record = entry as Record<string, unknown>
  for (const field of ["lastUpdated", "updatedAt", "publishedAt"]) {
    const value = record[field]
    if (typeof value === "string" && value !== "") return value
  }
  return ""
}

function compareRecency<T extends { slug: string }>(a: T, b: T): number {
  const byDate = recencyOf(b).localeCompare(recencyOf(a))
  return byDate !== 0 ? byDate : a.slug.localeCompare(b.slug)
}

function buildCategoryIndex(
  guides: { slug: string; category: string }[],
  comparisons: { slug: string; category: string }[],
  posts: { slug: string; category: string }[],
  glossary: { slug: string; category: string }[],
): Map<string, string> {
  const index = new Map<string, string>()
  const add = (type: RelatedType, entries: { slug: string; category: string }[]) => {
    for (const entry of entries) index.set(`${type}:${entry.slug}`, entry.category)
  }
  add("guide", guides)
  add("comparison", comparisons)
  add("blog", posts)
  add("glossary", glossary)
  return index
}

export function getRelatedByCategory(
  category: string,
  excludeSlug: string,
  maxPerType = 4,
): RelatedResult {
  const reviewsRaw = getCachedRelatedSource("reviews", getAllReviews)
  const comparisonsRaw = getCachedRelatedSource("comparisons", getAllComparisons)
  const guidesRaw = getCachedRelatedSource("guides", getAllGuides)
  const bestRaw = getCachedRelatedSource("best", getAllBest)
  const alternativesRaw = getCachedRelatedSource("alternatives", getAllAlternatives)
  const useCasesRaw = getCachedRelatedSource("use-cases", getAllUseCases)
  const hubsRaw = getCachedRelatedSource("hubs", getAllHubs)
  const industriesRaw = getCachedRelatedSource("industries", getAllIndustries)
  const researchRaw = getCachedRelatedSource("research", getAllResearch)
  const statisticsRaw = getCachedRelatedSource("statistics", getAllStatistics)
  const blogRaw = getCachedRelatedSource("blog", getAllBlogPosts)
  const glossaryRaw = getCachedRelatedSource("glossary", getAllGlossaryTerms)

  const categoryIndex = buildCategoryIndex(guidesRaw, comparisonsRaw, blogRaw, glossaryRaw)

  const reviews = buildBucket({
    type: "review",
    source: reviewsRaw,
    matchOf: (r): MatchKind | null => (sameCategory(r.category, category) ? "direct" : null),
    toItem: (r) => ({ slug: r.slug, title: r.name, type: "review", category: r.category, rating: r.rating }),
    compare: (a, b) => (b.rating || 0) - (a.rating || 0),
  }, excludeSlug, maxPerType)

  const comparisons = buildBucket({
    type: "comparison",
    source: comparisonsRaw,
    matchOf: (c): MatchKind | null =>
      sameCategory(c.category, category) || c.secondaryCategories?.some((candidate) => sameCategory(candidate, category)) ? "direct" : null,
    toItem: (c) => ({ slug: c.slug, title: c.title, type: "comparison", category: c.category }),
    compare: (a, b) => (b.lastUpdated || "").localeCompare(a.lastUpdated || ""),
  }, excludeSlug, maxPerType)

  const guides = buildBucket({
    type: "guide",
    source: guidesRaw,
    matchOf: (g): MatchKind | null => (sameCategory(g.category, category) ? "direct" : null),
    toItem: (g) => ({ slug: g.slug, title: g.title, type: "guide", category: g.category }),
    compare: (a, b) => (b.lastUpdated || "").localeCompare(a.lastUpdated || ""),
  }, excludeSlug, maxPerType)

  const bestPages = buildBucket({
    type: "best",
    source: bestRaw,
    matchOf: (b): MatchKind | null => (sameCategory(b.category, category) ? "direct" : null),
    toItem: (b) => ({ slug: b.slug, title: b.title, type: "best", category: b.category }),
    compare: (a, b) => (b.lastUpdated || "").localeCompare(a.lastUpdated || ""),
  }, excludeSlug, maxPerType)

  const alternatives = buildBucket({
    type: "alternative",
    source: alternativesRaw,
    matchOf: (a): MatchKind | null => (sameCategory(a.category, category) ? "direct" : null),
    toItem: (a) => ({ slug: a.slug, title: a.title, type: "alternative", category: a.category }),
    compare: (a, b) => (b.lastUpdated || "").localeCompare(a.lastUpdated || ""),
  }, excludeSlug, maxPerType)

  const useCases = buildBucket({
    type: "use-case",
    source: useCasesRaw,
    matchOf: (u) =>
      sameCategory(u.category, category)
        ? "direct"
        : hasAudienceMatch(u, category)
          ? "audience"
          : hasRelatedMatch(u, category, categoryIndex)
            ? "related"
            : null,
    toItem: (u) => ({ slug: u.slug, title: u.title, type: "use-case", category: u.category }),
    compare: compareRecency,
  }, excludeSlug, maxPerType)

  const hubs = buildBucket({
    type: "hub",
    source: hubsRaw,
    matchOf: (h) =>
      sameCategory(h.audience, category)
        ? "direct"
        : hasAudienceMatch(h, category)
          ? "audience"
          : hasRelatedMatch(h, category, categoryIndex)
            ? "related"
            : null,
    toItem: (h) => ({ slug: h.slug, title: h.title, type: "hub", category: h.audience }),
    compare: compareRecency,
  }, excludeSlug, maxPerType)

  const industries = buildBucket({
    type: "industry",
    source: industriesRaw,
    matchOf: (i) =>
      sameCategory(i.industry, category)
        ? "direct"
        : hasAudienceMatch(i, category)
          ? "audience"
          : hasRelatedMatch(i, category, categoryIndex)
            ? "related"
            : null,
    toItem: (i) => ({ slug: i.slug, title: i.title, type: "industry", category: i.industry }),
    compare: compareRecency,
  }, excludeSlug, maxPerType)

  const research = buildBucket({
    type: "research",
    source: researchRaw,
    matchOf: (r) =>
      sameCategory(r.category, category)
        ? "direct"
        : hasRelatedMatch(r, category, categoryIndex)
          ? "related"
          : null,
    toItem: (r) => ({ slug: r.slug, title: r.title, type: "research", category: r.category }),
    compare: compareRecency,
  }, excludeSlug, maxPerType)

  const statistics = buildBucket({
    type: "statistic",
    source: statisticsRaw,
    matchOf: (s) =>
      sameCategory(s.category, category)
        ? "direct"
        : hasRelatedMatch(s, category, categoryIndex)
          ? "related"
          : null,
    toItem: (s) => ({ slug: s.slug, title: s.title, type: "statistic", category: s.category }),
    compare: compareRecency,
  }, excludeSlug, maxPerType)

  const blogPosts = buildBucket({
    type: "blog",
    source: blogRaw,
    matchOf: (p) =>
      sameCategory(p.category, category)
        ? "direct"
        : hasRelatedMatch(p, category, categoryIndex)
          ? "related"
          : null,
    toItem: (p) => ({ slug: p.slug, title: p.title, type: "blog", category: p.category }),
    compare: compareRecency,
  }, excludeSlug, maxPerType)

  const glossaryTerms = buildBucket({
    type: "glossary",
    source: glossaryRaw,
    matchOf: (t) =>
      sameCategory(t.category, category)
        ? "direct"
        : hasRelatedMatch(t, category, categoryIndex)
          ? "related"
          : null,
    toItem: (t) => ({ slug: t.slug, title: t.term, type: "glossary", category: t.category }),
    compare: compareRecency,
  }, excludeSlug, maxPerType)

  const buckets = [
    reviews,
    comparisons,
    guides,
    bestPages,
    alternatives,
    useCases,
    hubs,
    industries,
    research,
    statistics,
    blogPosts,
    glossaryTerms,
  ]

  const merged: { ranked: RankedItem; score: number }[] = []
  for (const bucket of buckets) {
    for (const ranked of bucket) {
      merged.push({ ranked, score: MATCH_WEIGHT[ranked.match] * FAMILY_COUNT + FAMILY_WEIGHT[ranked.item.type] })
    }
  }
  merged.sort((a, b) => a.score - b.score || a.ranked.rank - b.ranked.rank)

  const seen = new Set<string>()
  const related: RelatedItem[] = []
  for (const entry of merged) {
    const href = getHref(entry.ranked.item)
    if (seen.has(href)) continue
    seen.add(href)
    related.push(entry.ranked.item)
  }

  return {
    reviews: reviews.map((r) => r.item),
    comparisons: comparisons.map((r) => r.item),
    guides: guides.map((r) => r.item),
    bestPages: bestPages.map((r) => r.item),
    alternatives: alternatives.map((r) => r.item),
    useCases: useCases.map((r) => r.item),
    hubs: hubs.map((r) => r.item),
    industries: industries.map((r) => r.item),
    research: research.map((r) => r.item),
    statistics: statistics.map((r) => r.item),
    blogPosts: blogPosts.map((r) => r.item),
    glossaryTerms: glossaryTerms.map((r) => r.item),
    related,
  }
}

export function getHref(item: RelatedItem): string {
  switch (item.type) {
    case "review": return `/reviews/${item.slug}`
    case "comparison": return `/comparisons/${item.slug}`
    case "guide": return `/guides/${item.slug}`
    case "best": return `/best/${item.slug}`
    case "alternative": return `/alternatives/${item.slug}`
    case "use-case": return `/use-cases/${item.slug}`
    case "hub": return `/hubs/${item.slug}`
    case "industry": return `/industries/${item.slug}`
    case "research": return `/research/${item.slug}`
    case "statistic": return `/statistics/${item.slug}`
    case "blog": return `/blog/${item.slug}`
    case "glossary": return `/glossary/${item.slug}`
  }
}
