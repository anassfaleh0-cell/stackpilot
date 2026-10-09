import { describe, expect, it } from "vitest"
import { getAllComparisons, getComparison, isContentAvailable } from "@/lib/content/registry"

const unpublishedComparisons = [
  "1password-vs-appwrite",
  "1password-vs-auth0",
  "1password-vs-crowdstrike",
  "1password-vs-fathom",
]

describe("unpublished comparison records", () => {
  it("does not resolve unpublished records as public comparison pages", () => {
    for (const slug of unpublishedComparisons) {
      expect(getComparison(slug), slug).toBeNull()
      expect(isContentAvailable("comparison", slug), slug).toBe(false)
    }
  })

  it("excludes unpublished comparisons from public listing and sitemap data", () => {
    const publicSlugs = new Set(getAllComparisons().map((comparison) => comparison.slug))
    for (const slug of unpublishedComparisons) {
      expect(publicSlugs.has(slug), slug).toBe(false)
    }
  })
})
