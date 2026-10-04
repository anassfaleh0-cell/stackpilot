import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import {
  H02_PROSE_FIELDS,
  H02_PROSE_REFERENCE_PATTERNS,
  H02_PROSE_SCOPE_SIZE,
  H02_PROSE_SCOPE_SLUGS,
} from "@/lib/content/h02-contract"

const ROOT = process.cwd()

const SINGULAR_ALTERNATIVES_POINTER =
  /\balternative\s+(?:listing|listings|page|pages|file|files|record|records|dataset|data\s+set|entry|entries|description|descriptions)\b/i

const BANNED_TOKENS = [
  "/alternatives/",
  "alternative listing",
  "alternative listings",
  "alternative page",
  "alternative pages",
  "alternative file",
  "alternative files",
  "recorded alternatives",
]

const FROZEN_PATTERNS = H02_PROSE_REFERENCE_PATTERNS.map(pattern => new RegExp(pattern, "i"))

interface ProseValue {
  field: string
  value: string
}

interface PageFacts {
  object_id: undefined
  published: undefined
  noindex: undefined
  rating: number
  priceRange: string
  pros: number
  cons: number
  content: number
  faqs: number
}

const FROZEN_PAGE_FACTS: Record<string, PageFacts> = {
  invision: {
    object_id: undefined,
    published: undefined,
    noindex: undefined,
    rating: 4.2,
    priceRange: "$9.95-100/mo",
    pros: 5,
    cons: 3,
    content: 9,
    faqs: 5,
  },
  ringcentral: {
    object_id: undefined,
    published: undefined,
    noindex: undefined,
    rating: 4.1,
    priceRange: "$30-45/mo",
    pros: 5,
    cons: 3,
    content: 10,
    faqs: 5,
  },
}

const PHASE5I_TARGETS = [
  { slug: "invision", location: "pros[3]" },
  { slug: "invision", location: "cons[2]" },
  { slug: "invision", location: "content[8].body" },
  { slug: "ringcentral", location: "content[0].body" },
] as const

const PHASE5I_TARGET_COUNT = 4

function readReview(slug: string): Record<string, unknown> {
  const file = path.join(ROOT, "content", "reviews", `${slug}.json`)
  return JSON.parse(fs.readFileSync(file, "utf8")) as Record<string, unknown>
}

function collectProse(review: Record<string, unknown>): ProseValue[] {
  const out: ProseValue[] = []
  const add = (field: string, value: unknown): void => {
    if (typeof value === "string") out.push({ field, value })
  }

  const sections = (review.content ?? []) as { title?: unknown; body?: unknown }[]
  for (const section of sections) {
    add("content[].title", section.title)
    add("content[].body", section.body)
  }

  const faqs = (review.faqs ?? []) as { question?: unknown; answer?: unknown }[]
  for (const faq of faqs) {
    add("faqs[].question", faq.question)
    add("faqs[].answer", faq.answer)
  }

  const pros = (review.pros ?? []) as unknown[]
  for (const item of pros) add("pros[]", item)

  const cons = (review.cons ?? []) as unknown[]
  for (const item of cons) add("cons[]", item)

  return out
}

function targetValue(slug: string, location: string): string {
  const review = readReview(slug)
  const sections = (review.content ?? []) as { body?: string }[]
  if (location === "pros[3]") return (review.pros as string[])[3]
  if (location === "cons[2]") return (review.cons as string[])[2]
  if (location === "content[8].body") return sections[8]?.body ?? ""
  if (location === "content[0].body") return sections[0]?.body ?? ""
  throw new Error(`unknown Phase 5I target: ${slug} ${location}`)
}

describe("Phase 5I T-SING-01 singular alternatives pointers", () => {
  it("counts zero across all six H02 prose fields and all 23 H02 scope pages", () => {
    expect(H02_PROSE_SCOPE_SIZE).toBe(23)
    expect(H02_PROSE_SCOPE_SLUGS).toHaveLength(23)
    expect(H02_PROSE_FIELDS).toHaveLength(6)

    const seenFields = new Set<string>()
    let matches = 0
    for (const slug of H02_PROSE_SCOPE_SLUGS) {
      for (const prose of collectProse(readReview(slug))) {
        seenFields.add(prose.field)
        if (SINGULAR_ALTERNATIVES_POINTER.test(prose.value)) matches += 1
      }
    }

    expect([...seenFields].sort()).toEqual([...H02_PROSE_FIELDS].sort())
    expect(matches).toBe(0)
  })
})

describe("Phase 5I T-SING-02 frozen H02 pattern audit", () => {
  it("stays at zero for the seven frozen H02 reference patterns", () => {
    expect(H02_PROSE_REFERENCE_PATTERNS).toHaveLength(7)

    let matches = 0
    for (const slug of H02_PROSE_SCOPE_SLUGS) {
      for (const prose of collectProse(readReview(slug))) {
        if (FROZEN_PATTERNS.some(pattern => pattern.test(prose.value))) matches += 1
      }
    }

    expect(matches).toBe(0)
  })
})

describe("Phase 5I T-SING-03 remediated locations", () => {
  it("carry none of the banned alternatives tokens", () => {
    for (const target of PHASE5I_TARGETS) {
      const value = targetValue(target.slug, target.location).toLowerCase()
      for (const token of BANNED_TOKENS) {
        expect(value, `${target.slug} ${target.location} must not contain "${token}"`).not.toContain(
          token,
        )
      }
    }
  })
})

describe("Phase 5I T-SING-04 remediation target count", () => {
  it("is frozen at exactly four unique locations", () => {
    expect(PHASE5I_TARGET_COUNT).toBe(4)
    expect(PHASE5I_TARGETS).toHaveLength(PHASE5I_TARGET_COUNT)

    const unique = new Set(PHASE5I_TARGETS.map(target => `${target.slug} ${target.location}`))
    expect(unique.size).toBe(PHASE5I_TARGET_COUNT)

    for (const target of PHASE5I_TARGETS) {
      expect(targetValue(target.slug, target.location).length).toBeGreaterThan(0)
    }
  })
})

describe("Phase 5I T-SING-05 content integrity", () => {
  it("leaves every frozen page fact on invision and ringcentral unchanged", () => {
    for (const slug of Object.keys(FROZEN_PAGE_FACTS)) {
      const review = readReview(slug)
      const facts = FROZEN_PAGE_FACTS[slug]

      expect(review.object_id).toBe(facts.object_id)
      expect(review.published).toBe(facts.published)
      expect(review.noindex).toBe(facts.noindex)
      expect(review.rating).toBe(facts.rating)
      expect(review.priceRange).toBe(facts.priceRange)
      expect((review.pros as unknown[]).length).toBe(facts.pros)
      expect((review.cons as unknown[]).length).toBe(facts.cons)
      expect((review.content as unknown[]).length).toBe(facts.content)
      expect((review.faqs as unknown[]).length).toBe(facts.faqs)
    }
  })
})
