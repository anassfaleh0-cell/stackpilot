import { describe, expect, it } from "vitest"
import { getAlternative, getBest, getComparison, getReview, isContentAvailable } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import nextConfig from "../../next.config"
import fs from "node:fs"
import path from "node:path"

const comparisonSlugs = [
  "bitbucket-vs-vercel",
  "cloudflare-pages-vs-supabase",
  "freshsales-vs-zoho-crm",
  "appwrite-vs-bitbucket",
  "logrocket-vs-podman",
  "containerd-vs-kubernetes",
  "bitbucket-vs-podman",
  "bitbucket-vs-kubernetes",
  "discord-vs-telegram",
  "github-vs-vercel",
  "firebase-vs-sourceforge",
  "containerd-vs-gitlab",
  "logrocket-vs-supabase",
  "square-vs-xero",
  "cloudflare-pages-vs-firebase",
  "circleci-vs-netlify",
  "expensify-vs-sage-intacct",
  "google-meet-vs-slack",
  "gitlab-vs-jfrog",
  "bamboohr-vs-lever",
  "docker-vs-terraform",
  "paddle-vs-wave",
  "invision-vs-sketch",
  "discord-vs-google-meet",
  "hi-bob-vs-rippling",
  "basecamp-vs-trello",
  "circleci-vs-docker",
]
const alternativeSlugs = ["clickup-alternatives"]

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

  it("restores the ClickUp alternatives guide without unsupported ranking claims", () => {
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
  it("routes the intentionally unpublished Grammarly alternatives draft to the real indexable review", async () => {
    const redirects = await nextConfig.redirects?.()
    expect(redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({
        source: "/alternatives/grammarly-alternatives",
        destination: "/reviews/grammarly",
        permanent: true,
      }),
    ]))
    const draft = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "alternatives", "grammarly-alternatives.json"), "utf8")) as { published?: boolean; publicationStatus?: string }
    expect(draft.published).toBe(false)
    expect(draft.publicationStatus).toBe("draft")
    expect(getReview("grammarly")).not.toBeNull()
    expect(isContentAvailable("review", "grammarly")).toBe(true)
    expect(isNoindexed("reviews", "grammarly")).toBe(false)
  })

  it("restores the reported shortlist pages with unverified scores and prices withheld", () => {
    const bestSlugs = [
      "best-marketing-seo-startups",
      "best-developer-tools-agencies",
      "best-ai-video-tools",
      "best-business-intelligence",
    ]
    for (const slug of bestSlugs) {
      const file = path.join(process.cwd(), "content", "best", `${slug}.json`)
      const record = JSON.parse(fs.readFileSync(file, "utf8")) as {
        published?: boolean
        publicationStatus?: string
        title?: string
        description?: string
        picks?: { rating: number; ratingVerified?: boolean; priceRangeVerified?: boolean }[]
      }
      expect(record.published, slug).toBe(true)
      expect(record.publicationStatus, slug).toBe("published")
      expect(record.title, slug).not.toMatch(/^Best /i)
      expect(record.description, slug).not.toMatch(/\b\d(?:\.\d)?\/5\b|\$\d/)
      expect(record.picks?.length, slug).toBeGreaterThan(0)
      expect(record.picks?.every((pick) => pick.ratingVerified === false && pick.priceRangeVerified === false), slug).toBe(true)
      expect(getBest(slug), slug).not.toBeNull()
      expect(isContentAvailable("best", slug), slug).toBe(true)
      expect(isNoindexed("best", slug), slug).toBe(false)
    }
  })

})
