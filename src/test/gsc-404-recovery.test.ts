import { describe, expect, it } from "vitest"
import { getAlternative, getComparison, isContentAvailable } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import fs from "node:fs"
import path from "node:path"

const comparisonSlugs = [
  "bitbucket-vs-vercel",
  "cloudflare-pages-vs-supabase",
  "freshsales-vs-zoho-crm",
  "appwrite-vs-bitbucket",
  "logrocket-vs-podman",
]
const alternativeSlugs = ["clickup-alternatives", "grammarly-alternatives"]

describe("Search Console 404 recovery", () => {
  it("restores real comparison records as indexable, evidence-led decision guides", () => {
    for (const slug of comparisonSlugs) {
      const file = path.join(process.cwd(), "content", "comparisons", `${slug}.json`)
      const record = JSON.parse(fs.readFileSync(file, "utf8")) as {
        published?: boolean
        publicationStatus?: string
        winner?: string | null
        winnerVerified?: boolean
        featuresVerified?: boolean
        decisionGuide?: boolean
        lastUpdated?: string
        description?: string
      }
      expect(record.published, slug).toBe(true)
      expect(record.publicationStatus, slug).toBe("published")
      expect(record.winner, slug).toBeNull()
      expect(record.winnerVerified, slug).toBe(false)
      expect(record.featuresVerified, slug).toBe(false)
      expect(record.decisionGuide, slug).toBe(true)
      expect(record.lastUpdated, slug).toBeUndefined()
      expect(record.description, slug).not.toMatch(/\b\d(?:\.\d)?\/5\b|overall pick/i)
      expect(getComparison(slug), slug).not.toBeNull()
      expect(isContentAvailable("comparison", slug), slug).toBe(true)
      expect(isNoindexed("comparisons", slug), slug).toBe(false)
    }
  })

  it("restores requested alternatives pages without unsupported ranking claims", () => {
    for (const slug of alternativeSlugs) {
      const file = path.join(process.cwd(), "content", "alternatives", `${slug}.json`)
      const record = JSON.parse(fs.readFileSync(file, "utf8")) as {
        published?: boolean
        publicationStatus?: string
        title?: string
        description?: string
        alternatives?: { slug: string; rating: number; description: string }[]
        sections?: { title: string; body?: string }[]
        lastUpdated?: string
      }
      expect(record.published, slug).toBe(true)
      expect(record.publicationStatus, slug).toBe("published")
      expect(record.title, slug).not.toMatch(/\bbest\b|\btop 5\b/i)
      expect(record.description, slug).not.toMatch(/\b4\.\d\/5\b|top 5 alternatives/i)
      expect(record.alternatives?.length, slug).toBeGreaterThanOrEqual(5)
      expect(record.alternatives?.every((item) => item.rating === 0), slug).toBe(true)
      expect(record.sections?.length, slug).toBeGreaterThanOrEqual(4)
      expect(getAlternative(slug), slug).not.toBeNull()
      expect(isContentAvailable("alternative", slug), slug).toBe(true)
      expect(isNoindexed("alternatives", slug), slug).toBe(false)
    }
  })
})
