import { describe, it, expect } from "vitest"
import {
  getRelatedByCategory,
  getHref,
  type RelatedItem,
  type RelatedResult,
  type RelatedType,
} from "@/lib/content/internal-links"
import {
  isContentAvailable,
  getAllReviews,
  getAllComparisons,
  getAllGuides,
  getAllBest,
  getAllAlternatives,
  getAllGlossaryTerms,
  getAllStatistics,
} from "@/lib/content/registry"

const NEW_TYPES: RelatedType[] = ["use-case", "hub", "industry", "research", "statistic", "blog", "glossary"]
const NEW_BUCKETS = ["useCases", "hubs", "industries", "research", "statistics", "blogPosts", "glossaryTerms"] as const

const PREFIX: Record<RelatedType, string> = {
  review: "/reviews/",
  comparison: "/comparisons/",
  guide: "/guides/",
  best: "/best/",
  alternative: "/alternatives/",
  "use-case": "/use-cases/",
  hub: "/hubs/",
  industry: "/industries/",
  research: "/research/",
  statistic: "/statistics/",
  blog: "/blog/",
  glossary: "/glossary/",
}

const CATEGORIES = [
  "Marketing & SEO",
  "HR & People",
  "CRM & Sales",
  "Developer Tools",
  "Finance & Accounting",
  "Project Management",
  "Productivity",
  "Analytics & Data",
  "Security & Compliance",
  "Design & Creative",
]

function buckets(result: RelatedResult): RelatedItem[][] {
  return [
    result.reviews,
    result.comparisons,
    result.guides,
    result.bestPages,
    result.alternatives,
    result.useCases,
    result.hubs,
    result.industries,
    result.research,
    result.statistics,
    result.blogPosts,
    result.glossaryTerms,
  ]
}

function allItems(result: RelatedResult): RelatedItem[] {
  const items: RelatedItem[] = []
  for (const bucket of buckets(result)) for (const item of bucket) items.push(item)
  return items
}

function slugs(result: RelatedResult): string[] {
  return allItems(result).map((item) => item.slug)
}

describe("Phase 5O-B-1: internal link discovery", () => {
  it("discovers the priority use-case targets from their own categories", { timeout: 60000 }, () => {
    expect(getRelatedByCategory("Marketing & SEO", "").useCases.map((u) => u.slug)).toContain("best-seo-for-agencies")
    expect(getRelatedByCategory("HR & People", "").useCases.map((u) => u.slug)).toContain("best-hr-for-small-business")
    expect(getRelatedByCategory("CRM & Sales", "").useCases.map((u) => u.slug)).toContain("best-crm-for-small-business")
  })

  it("discovers every new content family through an existing semantic relationship", { timeout: 60000 }, () => {
    const marketing = getRelatedByCategory("Marketing & SEO", "")
    expect(marketing.useCases.length).toBeGreaterThan(0)
    expect(marketing.hubs.map((h) => h.slug)).toContain("software-for-agencies")
    expect(marketing.blogPosts.length).toBeGreaterThan(0)

    expect(getRelatedByCategory("HR & People", "").industries.length).toBeGreaterThan(0)
    expect(getRelatedByCategory("Productivity", "").research.map((r) => r.slug)).toContain("ai-productivity-report-2026")
    expect(getRelatedByCategory("Communication", "").statistics.map((s) => s.slug)).toContain("communication-software")
    expect(getRelatedByCategory("Developer Tools", "").glossaryTerms.map((g) => g.slug)).toContain("api")
  })

  it("never returns a noindex target for any enforced content type", { timeout: 60000 }, () => {
    const pool: Record<string, () => { slug: string }[]> = {
      review: getAllReviews,
      comparison: getAllComparisons,
      guide: getAllGuides,
      best: getAllBest,
      alternative: getAllAlternatives,
      glossary: getAllGlossaryTerms,
      statistic: getAllStatistics,
    }
    const fixtures = [
      { type: "review", category: "Design & Creative", slug: "affinity", keep: "figma" },
      { type: "comparison", category: "Productivity", slug: "airtable-vs-notion", keep: "clickup-vs-notion-small-teams" },
      { type: "guide", category: "CRM & Sales", slug: "crm-migration-checklist", keep: "crm-pricing-guide" },
      { type: "best", category: "Marketing & SEO", slug: "best-marketing-software", keep: "best-marketing-seo-enterprise" },
      { type: "alternative", category: "HR & People", slug: "gusto-alternatives", keep: "bamboohr-alternatives" },
      { type: "glossary", category: "Developer Tools", slug: "devops", keep: "api" },
      { type: "statistic", category: "Data Engineering", slug: "dataengineering-software", keep: "" },
    ] as const

    for (const fixture of fixtures) {
      const item: RelatedItem = { slug: fixture.slug, title: fixture.slug, type: fixture.type, category: fixture.category }
      expect(pool[fixture.type]().some((entry) => entry.slug === fixture.slug), `${fixture.slug} should be a candidate`).toBe(true)
      expect(isContentAvailable(fixture.type, fixture.slug), `${fixture.type}/${fixture.slug} must not be linkable`).toBe(false)

      const result = getRelatedByCategory(fixture.category, "", 500)
      expect(slugs(result), `${fixture.slug} must not be returned`).not.toContain(fixture.slug)
      expect(result.related.map((entry) => getHref(entry)), `${getHref(item)} must not be linked`).not.toContain(getHref(item))

      if (fixture.keep !== "") {
        expect(slugs(result), `indexable sibling ${fixture.keep} should still be returned`).toContain(fixture.keep)
      }
    }

    expect(isContentAvailable("statistic", "aerospace-software")).toBe(true)
    expect(getRelatedByCategory("Aerospace", "", 500).statistics.map((s) => s.slug)).toContain("aerospace-software")
  })

  it("suppresses unpublished and missing targets", { timeout: 60000 }, () => {
    expect(isContentAvailable("comparison", "1password-vs-appwrite")).toBe(false)
    expect(isContentAvailable("best", "best-ai-coding-tools")).toBe(false)
    expect(isContentAvailable("alternative", "1password-alternatives")).toBe(false)
    expect(isContentAvailable("comparison", "definitely-not-a-real-comparison")).toBe(false)
    expect(isContentAvailable("review", "definitely-not-a-real-review")).toBe(false)
    expect(isContentAvailable("use-case", "definitely-not-a-real-use-case")).toBe(false)
    expect(isContentAvailable("hub", "definitely-not-a-real-hub")).toBe(false)

    const devtools = getRelatedByCategory("Developer Tools", "", 500)
    expect(slugs(devtools)).not.toContain("appwrite-vs-bitbucket")
    expect(devtools.comparisons.map((c) => c.slug)).toContain("firebase-vs-appwrite")
    expect(devtools.reviews.length).toBeGreaterThan(0)
  })

  it("only returns linkable, de-duplicated, relevance-ranked links across the ten test categories", { timeout: 120000 }, () => {
    for (const category of CATEGORIES) {
      const result = getRelatedByCategory(category, "", 4)

      for (const item of allItems(result)) {
        expect(isContentAvailable(item.type, item.slug), `${category} -> ${getHref(item)}`).toBe(true)
        expect(getHref(item).startsWith(PREFIX[item.type]), `${item.type} -> ${getHref(item)}`).toBe(true)
      }

      const hrefs = result.related.map((item) => getHref(item))
      expect(new Set(hrefs).size, `${category} has duplicate hrefs`).toBe(hrefs.length)
      expect(result.related.length).toBeLessThanOrEqual(allItems(result).length)

      const types = result.related.map((item) => item.type)
      expect(types.findIndex((type) => NEW_TYPES.includes(type)), `${category} should surface a new family`).toBeGreaterThanOrEqual(0)
    }
  })

  it("interleaves new families with the original five instead of appending them", { timeout: 60000 }, () => {
    const types = getRelatedByCategory("Marketing & SEO", "", 4).related.map((item) => item.type)
    const at = (type: RelatedType) => {
      const index = types.indexOf(type)
      expect(index, `${type} missing from related list`).toBeGreaterThanOrEqual(0)
      return index
    }
    expect(at("review")).toBeLessThan(at("use-case"))
    expect(at("use-case")).toBeLessThan(at("guide"))
    expect(at("guide")).toBeLessThan(at("blog"))
    expect(at("best")).toBeLessThan(at("hub"))
  })

  it("preserves the per-family limit instead of growing the output", { timeout: 60000 }, () => {
    const four = getRelatedByCategory("Developer Tools", "", 4)
    for (const bucket of buckets(four)) expect(bucket.length).toBeLessThanOrEqual(4)
    expect(four.blogPosts.length).toBe(4)

    const two = getRelatedByCategory("Developer Tools", "", 2)
    for (const bucket of buckets(two)) expect(bucket.length).toBeLessThanOrEqual(2)
    expect(two.related.length).toBeLessThanOrEqual(four.related.length)
  })

  it("preserves the existing relevance ordering of the original five families", { timeout: 60000 }, () => {
    const category = "Developer Tools"
    const result = getRelatedByCategory(category, "", 500)

    const ratings = new Map(getAllReviews().map((r) => [r.slug, r.rating]))
    for (let i = 1; i < result.reviews.length; i++) {
      expect(ratings.get(result.reviews[i - 1].slug)!).toBeGreaterThanOrEqual(ratings.get(result.reviews[i].slug)!)
    }

    const dates = (items: { slug: string }[], lookup: Map<string, string>) => {
      for (let i = 1; i < items.length; i++) {
        expect(lookup.get(items[i - 1].slug)! >= lookup.get(items[i].slug)!, `${items[i - 1].slug} -> ${items[i].slug}`).toBe(true)
      }
    }
    const guideDates = new Map(getAllGuides().map((g) => [g.slug, g.lastUpdated || ""]))
    const comparisonDates = new Map(getAllComparisons().map((c) => [c.slug, c.lastUpdated || ""]))
    const bestDates = new Map(getAllBest().map((b) => [b.slug, b.lastUpdated || ""]))
    const alternativeDates = new Map(getAllAlternatives().map((a) => [a.slug, a.lastUpdated || ""]))

    dates(result.guides, guideDates)
    dates(result.comparisons, comparisonDates)
    dates(result.bestPages, bestDates)
    dates(result.alternatives, alternativeDates)

    expect(result.reviews.map((i) => i.slug)).toEqual(getRelatedByCategory(category, "", 500).reviews.map((i) => i.slug))
    expect(result.guides.slice(0, 4).map((i) => i.slug)).toEqual(getRelatedByCategory(category, "").guides.map((i) => i.slug))
  })

  it("does not blindly return all seven new content families", { timeout: 60000 }, () => {
    const niche = getRelatedByCategory("Video Communication", "", 4)
    const populated = NEW_BUCKETS.filter((key) => niche[key].length > 0)
    expect(populated.length).toBeLessThan(NEW_BUCKETS.length)
    expect(niche.useCases.length).toBeGreaterThan(0)
    expect(niche.hubs.length).toBe(0)
    expect(niche.statistics.length).toBe(0)

    const security = getRelatedByCategory("Security & Compliance", "", 500)
    expect(security.research.length).toBe(0)
    expect(security.statistics.length).toBe(0)
  })

  it("never returns the source page itself", { timeout: 60000 }, () => {
    const review = getRelatedByCategory("Marketing & SEO", "ahrefs")
    expect(review.reviews.map((i) => i.slug)).not.toContain("ahrefs")
    expect(review.related.map((i) => getHref(i))).not.toContain("/reviews/ahrefs")

    const useCase = getRelatedByCategory("Marketing & SEO", "best-seo-for-agencies")
    expect(useCase.useCases.map((i) => i.slug)).not.toContain("best-seo-for-agencies")
    expect(useCase.related.map((i) => getHref(i))).not.toContain("/use-cases/best-seo-for-agencies")
  })
})
