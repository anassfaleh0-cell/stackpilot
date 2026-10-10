import { describe, expect, it } from "vitest"
import { getAllComparisons, getComparison, isContentAvailable } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import fs from "node:fs"

const unpublishedComparisons = [
  "1password-vs-appwrite",
  "1password-vs-auth0",
  "1password-vs-crowdstrike",
  "1password-vs-fathom",
  "affinity-vs-wix",
  "dialpad-vs-loom",
  "adp-vs-airtable",
  "clickup-vs-gusto",
  "ahrefs-vs-claude",
  "copy-ai-vs-heap",
  "cal-com-vs-discord",
]

describe("unpublished comparison records", () => {
  it("does not resolve unpublished records as public comparison pages", () => {
    for (const slug of unpublishedComparisons) {
      const record = JSON.parse(fs.readFileSync(`content/comparisons/${slug}.json`, "utf8")) as { publicationStatus?: string }
      expect(record.publicationStatus, slug).toBe("draft")
      expect(getComparison(slug), slug).toBeNull()
      expect(isContentAvailable("comparison", slug), slug).toBe(false)
      expect(isNoindexed("comparisons", slug), slug).toBe(false)
    }
  })

  it("excludes unpublished comparisons from public listing and sitemap data", () => {
    const publicSlugs = new Set(getAllComparisons().map((comparison) => comparison.slug))
    for (const slug of unpublishedComparisons) {
      expect(publicSlugs.has(slug), slug).toBe(false)
    }
  })
})
