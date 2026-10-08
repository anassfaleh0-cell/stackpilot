import { describe, it, expect } from "vitest"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  getRelatedByCategory,
  getHref,
  type RelatedItem,
  type RelatedResult,
  type RelatedType,
} from "@/lib/content/internal-links"
import {
  InternalLinks,
  LEGACY_RELATED_TYPES,
  EXTENDED_RELATED_TYPES,
  extendedRelatedItems,
} from "@/components/content/internal-links"
import { EnhancedRelatedContent } from "@/components/content/enhanced-related-content"
import {
  isContentAvailable,
  getAllBest,
  getAllIndustries,
  getAllHubs,
  getAllAlternatives,
  getAllUseCases,
  getAllResearch,
  getAllStatistics,
  getAllBlogPosts,
  getAllGlossaryTerms,
} from "@/lib/content/registry"
import { isInternalLinkAvailable } from "@/lib/content/link-guard"
import { isNoindexed } from "@/lib/noindex"
import { categories } from "@/lib/constants"

const CATEGORIES = categories.map((entry) => entry.name)

const SECTION_ORDER: { title: string; family: RelatedType; bucket: keyof RelatedResult }[] = [
  { title: "Reviews", family: "review", bucket: "reviews" },
  { title: "Best Software", family: "best", bucket: "bestPages" },
  { title: "Use Cases", family: "use-case", bucket: "useCases" },
  { title: "Statistics", family: "statistic", bucket: "statistics" },
  { title: "Comparisons", family: "comparison", bucket: "comparisons" },
  { title: "Alternatives", family: "alternative", bucket: "alternatives" },
  { title: "Industries", family: "industry", bucket: "industries" },
  { title: "Research", family: "research", bucket: "research" },
  { title: "Guides", family: "guide", bucket: "guides" },
  { title: "Hubs", family: "hub", bucket: "hubs" },
  { title: "Blog Posts", family: "blog", bucket: "blogPosts" },
  { title: "Glossary Terms", family: "glossary", bucket: "glossaryTerms" },
]

const NEW_TITLES = SECTION_ORDER.filter((section) => !LEGACY_RELATED_TYPES.includes(section.family)).map(
  (section) => section.title
)

const relatedCache = new Map<string, RelatedResult>()

function related(category: string, excludeSlug: string = ""): RelatedResult {
  const key = category + "|" + excludeSlug
  let value = relatedCache.get(key)
  if (!value) {
    value = getRelatedByCategory(category, excludeSlug, 4)
    relatedCache.set(key, value)
  }
  return value
}

const internalCache = new Map<string, string>()

function renderInternal(props: { category: string; excludeSlug: string; families?: RelatedType[] }): string {
  const key = JSON.stringify([props.category, props.excludeSlug, props.families ?? null])
  let html = internalCache.get(key)
  if (html === undefined) {
    html = renderToStaticMarkup(React.createElement(InternalLinks, props))
    internalCache.set(key, html)
  }
  return html
}

function renderEnhanced(items: RelatedItem[] | undefined, maxItems: number = 6): string {
  return renderToStaticMarkup(React.createElement(EnhancedRelatedContent, { items, maxItems }))
}

function hrefs(html: string): string[] {
  const found: string[] = []
  const pattern = /<a[^>]*\shref="([^"]+)"[^>]*>/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(html)) !== null) found.push(match[1])
  return found
}

function linkTexts(html: string): string[] {
  const found: string[] = []
  const pattern = /<a[^>]*\shref="[^"]+"[^>]*>([\s\S]*?)<\/a>/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(html)) !== null) {
    found.push(match[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim())
  }
  return found
}

function headings(html: string): string[] {
  const found: string[] = []
  const pattern = /<h3[^>]*>([\s\S]*?)<\/h3>/g
  let match: RegExpExecArray | null
  while ((match = pattern.exec(html)) !== null) {
    found.push(match[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim())
  }
  return found
}

function expectedHeadings(category: string, excludeSlug: string = "", families?: RelatedType[]): string[] {
  const result = related(category, excludeSlug)
  return SECTION_ORDER.filter(
    (section) => (!families || families.includes(section.family)) && result[section.bucket].length > 0
  ).map((section) => section.title)
}

function expectedHrefs(category: string, excludeSlug: string = "", families?: RelatedType[]): string[] {
  const found: string[] = []
  for (const section of SECTION_ORDER) {
    if (families && !families.includes(section.family)) continue
    for (const item of related(category, excludeSlug)[section.bucket]) found.push(getHref(item))
  }
  return found
}

function available(
  type: RelatedType,
  all: { slug: string }[],
  category: string
): { slug: string; type: RelatedType; category: string } {
  const entry = all.find((candidate) => isContentAvailable(type, candidate.slug))
  if (!entry) throw new Error("no available " + type + " fixture")
  return { slug: entry.slug, type, category }
}

function pickPage<T extends { slug: string }>(
  type: string,
  entries: T[],
  categoryOf: (entry: T) => string
): { category: string; excludeSlug: string } {
  for (const entry of entries) {
    if (!isContentAvailable(type, entry.slug)) continue
    const category = categoryOf(entry)
    if (extendedRelatedItems(related(category, entry.slug)).length > 0) {
      return { category, excludeSlug: entry.slug }
    }
  }
  throw new Error("no " + type + " fixture with extended items")
}

describe("Phase 5O-B-2: internal link rendering", () => {
  it(
    "renders the five legacy sections with their existing labels",
    { timeout: 60000 },
    () => {
      const developerTools = renderInternal({ category: "Developer Tools", excludeSlug: "" })
      const marketing = renderInternal({ category: "Marketing & SEO", excludeSlug: "" })

      expect(headings(developerTools)).toEqual(expect.arrayContaining(["Reviews", "Comparisons", "Guides"]))
      expect(headings(marketing)).toEqual(expect.arrayContaining(["Reviews", "Best Software", "Guides"]))

      expect(hrefs(developerTools)).toEqual(expectedHrefs("Developer Tools"))
      expect(hrefs(marketing)).toEqual(expectedHrefs("Marketing & SEO"))
    }
  )

  it(
    "renders each of the seven newly discovered families as its own section",
    { timeout: 60000 },
    () => {
      const marketing = renderInternal({ category: "Marketing & SEO", excludeSlug: "" })
      const communication = renderInternal({ category: "Communication", excludeSlug: "" })

      expect(headings(marketing)).toEqual(
        expect.arrayContaining(["Use Cases", "Hubs", "Industries", "Research", "Blog Posts", "Glossary Terms"])
      )
      expect(headings(communication)).toContain("Statistics")

      expect(hrefs(marketing)).toEqual(
        expect.arrayContaining([
          "/use-cases/best-seo-for-agencies",
          "/hubs/software-for-agencies",
          "/glossary/ab-testing",
        ])
      )
      expect(hrefs(communication)).toEqual(
        expect.arrayContaining(["/statistics/communication-software"])
      )
    }
  )

  it(
    "emits exactly one section per family that has eligible items and none when it has none",
    { timeout: 60000 },
    () => {
      for (const category of CATEGORIES) {
        const html = renderInternal({ category, excludeSlug: "" })
        expect(headings(html), category).toEqual(expectedHeadings(category))
        expect(hrefs(html), category).toEqual(expectedHrefs(category))
      }
    }
  )

  it(
    "keeps the legacy section ordering intact",
    { timeout: 60000 },
    () => {
      const legacyTitles = ["Reviews", "Best Software", "Comparisons", "Alternatives", "Guides"]

      const developerTools = headings(renderInternal({ category: "Developer Tools", excludeSlug: "" }))
      const positions = legacyTitles.map((title) => developerTools.indexOf(title)).filter((index) => index >= 0)
      expect(positions.length).toBeGreaterThanOrEqual(3)
      expect(positions).toEqual([...positions].sort((a, b) => a - b))
      expect(developerTools.indexOf("Reviews")).toBeLessThan(developerTools.indexOf("Comparisons"))
      expect(developerTools.indexOf("Comparisons")).toBeLessThan(developerTools.indexOf("Guides"))

      for (const category of CATEGORIES) {
        const rendered = headings(renderInternal({ category, excludeSlug: "" }))
        const legacyPositions = legacyTitles
          .map((title) => rendered.indexOf(title))
          .filter((index) => index >= 0)
        expect(legacyPositions, category).toEqual([...legacyPositions].sort((a, b) => a - b))
      }
    }
  )

  it(
    "never renders the same href twice inside one block",
    { timeout: 60000 },
    () => {
      for (const category of CATEGORIES) {
        const found = hrefs(renderInternal({ category, excludeSlug: "" }))
        expect(new Set(found).size, category + " -> " + found.join(", ")).toBe(found.length)
      }
    }
  )

  it(
    "only renders links that resolve to published, indexable content",
    { timeout: 60000 },
    () => {
      for (const category of CATEGORIES) {
        for (const href of hrefs(renderInternal({ category, excludeSlug: "" }))) {
          expect(isInternalLinkAvailable(href), category + " -> " + href).toBe(true)
          const parts = href.slice(1).split("/")
          expect(isNoindexed(parts[0], parts[1]), category + " -> " + href + " is noindexed").toBe(false)
        }
      }
    }
  )

  it(
    "keeps real content fixtures eligible for internal linking",
    { timeout: 60000 },
    () => {
      const fixtures = [
        { category: "Design & Creative", href: "/reviews/affinity", type: "review", slug: "affinity" },
        { category: "Productivity", href: "/comparisons/notion-vs-confluence", type: "comparison", slug: "notion-vs-confluence" },
        { category: "CRM & Sales", href: "/guides/crm-migration-checklist", type: "guide", slug: "crm-migration-checklist" },
        { category: "Marketing & SEO", href: "/best/best-marketing-software", type: "best", slug: "best-marketing-software" },
        { category: "HR & People", href: "/alternatives/gusto-alternatives", type: "alternative", slug: "gusto-alternatives" },
        { category: "Developer Tools", href: "/glossary/devops", type: "glossary", slug: "devops" },
        { category: "Data Engineering", href: "/statistics/dataengineering-software", type: "statistic", slug: "dataengineering-software" },
      ]

      for (const fixture of fixtures) {
        expect(isContentAvailable(fixture.type, fixture.slug), fixture.href).toBe(true)
      }
    }
  )

  it(
    "gives every rendered link a non-empty accessible name",
    { timeout: 60000 },
    () => {
      for (const category of CATEGORIES) {
        for (const text of linkTexts(renderInternal({ category, excludeSlug: "" }))) {
          expect(text.length, category + " rendered an unnamed link").toBeGreaterThan(0)
        }
      }
    }
  )

  it(
    "renders no section for a family without eligible items",
    { timeout: 60000 },
    () => {
      expect(related("Video Communication").hubs).toHaveLength(0)
      expect(related("Video Communication").statistics).toHaveLength(0)
      const video = headings(renderInternal({ category: "Video Communication", excludeSlug: "" }))
      expect(video).not.toContain("Hubs")
      expect(video).not.toContain("Statistics")

      expect(related("Security & Compliance").research).toHaveLength(0)
      expect(related("Security & Compliance").statistics).toHaveLength(0)
      const security = headings(renderInternal({ category: "Security & Compliance", excludeSlug: "" }))
      expect(security).not.toContain("Research")
      expect(security).not.toContain("Statistics")
    }
  )

  it(
    "renders nothing at all when the category matches no content",
    { timeout: 60000 },
    () => {
      expect(renderInternal({ category: "No Such Category Anywhere", excludeSlug: "" })).toBe("")
      expect(renderEnhanced([])).toBe("")
      expect(renderEnhanced(undefined)).toBe("")
    }
  )

  it(
    "renders no new-family section on the four legacy-only pages",
    { timeout: 60000 },
    () => {
      for (const category of CATEGORIES) {
        const html = renderInternal({ category, excludeSlug: "", families: LEGACY_RELATED_TYPES })
        expect(headings(html), category).toEqual(expectedHeadings(category, "", LEGACY_RELATED_TYPES))
        expect(
          headings(html).filter((title) => NEW_TITLES.includes(title)),
          category
        ).toEqual([])
        expect(hrefs(html), category).toEqual(expectedHrefs(category, "", LEGACY_RELATED_TYPES))
      }
    }
  )

  it(
    "activates the enhanced block on the four pages without duplicating the legacy block",
    { timeout: 120000 },
    () => {
      const pages = [
        { type: "best", ...pickPage("best", getAllBest(), (entry) => entry.category) },
        { type: "industry", ...pickPage("industry", getAllIndustries(), (entry) => entry.industry) },
        { type: "hub", ...pickPage("hub", getAllHubs(), (entry) => entry.audience) },
        { type: "alternative", ...pickPage("alternative", getAllAlternatives(), (entry) => entry.category) },
      ]

      for (const page of pages) {
        const category = page.category
        const excludeSlug = page.excludeSlug
        const legacyBlock = new Set(
          hrefs(renderInternal({ category, excludeSlug, families: LEGACY_RELATED_TYPES }))
        )
        const items = extendedRelatedItems(related(category, excludeSlug))
        const enhancedBlock = renderEnhanced(items)
        const enhancedHrefs = hrefs(enhancedBlock)

        expect(items.length, page.type + " should have extended items").toBeGreaterThan(0)
        expect(enhancedHrefs.length, page.type + " block is still dead").toBeGreaterThan(0)
        expect(
          enhancedHrefs.filter((href) => legacyBlock.has(href)),
          page.type + " duplicates a legacy href"
        ).toEqual([])

        for (const href of enhancedHrefs) {
          expect(isInternalLinkAvailable(href), page.type + " -> " + href).toBe(true)
          expect(legacyBlock.has(href)).toBe(false)
        }
        expect(items.every((item) => EXTENDED_RELATED_TYPES.includes(item.type))).toBe(true)
      }
    }
  )

  it(
    "keeps real content in the enhanced block",
    { timeout: 60000 },
    () => {
      expect(isContentAvailable("review", "affinity")).toBe(true)
      expect(isContentAvailable("comparison", "1password-vs-appwrite")).toBe(true)
      expect(isContentAvailable("comparison", "firebase-vs-appwrite")).toBe(true)

      const html = renderEnhanced([
        { slug: "affinity", title: "Affinity", type: "review", category: "Design & Creative" },
        { slug: "1password-vs-appwrite", title: "1Password vs Appwrite", type: "comparison", category: "Developer Tools" },
        { slug: "firebase-vs-appwrite", title: "Firebase vs Appwrite", type: "comparison", category: "Developer Tools" },
      ])

      expect(hrefs(html)).toEqual([
        "/reviews/affinity",
        "/comparisons/1password-vs-appwrite",
        "/comparisons/firebase-vs-appwrite",
      ])
      expect(isInternalLinkAvailable("/comparisons/firebase-vs-appwrite")).toBe(true)
    }
  )

  it(
    "labels every newly rendered family with a human-readable accessible label",
    { timeout: 60000 },
    () => {
      const items: RelatedItem[] = [
        { ...available("use-case", getAllUseCases(), "Marketing & SEO"), title: "Use Case Item" },
        { ...available("hub", getAllHubs(), "Agencies"), title: "Hub Item" },
        { ...available("industry", getAllIndustries(), "Education"), title: "Industry Item" },
        { ...available("research", getAllResearch(), "Analytics & Data"), title: "Research Item" },
        { ...available("statistic", getAllStatistics(), "Communication"), title: "Statistic Item" },
        { ...available("blog", getAllBlogPosts(), "Marketing & SEO"), title: "Blog Item" },
        { ...available("glossary", getAllGlossaryTerms(), "Developer Tools"), title: "Glossary Item" },
      ]

      const html = renderEnhanced(items, 12)

      for (const label of ["Use Case", "Hub", "Industry", "Research", "Statistics", "Article", "Glossary"]) {
        expect(html, "missing label " + label).toContain(">" + label + "<")
      }
      for (const raw of ["use-case", "glossary", "statistic"]) {
        expect(html, "raw type " + raw + " leaked into a label").not.toContain(">" + raw + "<")
      }
      for (const text of linkTexts(html)) expect(text.length).toBeGreaterThan(0)
    }
  )

  it(
    "keeps extendedRelatedItems a filtered, order-preserving view of the related list",
    { timeout: 60000 },
    () => {
      expect(new Set([...LEGACY_RELATED_TYPES, ...EXTENDED_RELATED_TYPES]).size).toBe(12)
      expect(LEGACY_RELATED_TYPES.filter((type) => EXTENDED_RELATED_TYPES.includes(type))).toEqual([])

      for (const category of CATEGORIES) {
        const result = related(category)
        const extended = extendedRelatedItems(result)
        if (extended.length === 0) continue

        expect(extended.every((item) => EXTENDED_RELATED_TYPES.includes(item.type)), category).toBe(true)

        const source = result.related.map((item) => getHref(item))
        const filtered = extended.map((item) => getHref(item))
        let cursor = 0
        for (const href of source) {
          if (cursor < filtered.length && href === filtered[cursor]) cursor++
        }
        expect(cursor, category + " reordered the related list").toBe(filtered.length)
      }
    }
  )
})
