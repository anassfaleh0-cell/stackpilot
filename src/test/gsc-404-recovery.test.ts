import { describe, expect, it } from "vitest"
import { getBest, getComparison, getReview, isContentAvailable } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import sitemap from "@/app/sitemap"
import { siteConfig } from "@/lib/constants"
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

  it("includes every restored GSC comparison URL in the canonical XML sitemap", () => {
    const canonicalOrigin = new URL(siteConfig.url).origin
    const sitemapPaths = new Set(sitemap().map((entry) => {
      const url = new URL(entry.url)
      expect(url.origin, entry.url).toBe(canonicalOrigin)
      return url.pathname
    }))

    for (const slug of comparisonSlugs) {
      expect(sitemapPaths.has(`/comparisons/${slug}`), slug).toBe(true)
    }
  })

  it("keeps intentionally unpublished alternatives drafts out of publication", () => {
    for (const slug of ["clickup-alternatives", "grammarly-alternatives"]) {
      const file = path.join(process.cwd(), "content", "alternatives", `${slug}.json`)
      const record = JSON.parse(fs.readFileSync(file, "utf8")) as { published?: boolean }
      expect(record.published, slug).toBe(false)
    }
  })

  it("keeps legacy feature URLs on canonical review routes", async () => {
    const redirects = await nextConfig.redirects?.()
    expect(redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "/reviews/acuity-scheduling", destination: "/reviews/acuity", permanent: true }),
      expect.objectContaining({ source: "/reviews/affinity-designer", destination: "/reviews/affinity", permanent: true }),
      expect.objectContaining({ source: "/reviews/quickbooks-self-employed", destination: "/reviews/quickbooks", permanent: true }),
      expect.objectContaining({ source: "/reviews/slack-huddles", destination: "/reviews/slack", permanent: true }),
    ]))
    const file = path.join(process.cwd(), "content", "comparisons", "acuity-vs-obsidian.json")
    const record = JSON.parse(fs.readFileSync(file, "utf8")) as { tool1Slug?: string }
    expect(record.tool1Slug).toBe("acuity")
  })

  it("routes intentionally unpublished alternatives drafts to their real indexable reviews", async () => {
    const redirects = await nextConfig.redirects?.()
    expect(redirects).toEqual(expect.arrayContaining([
      expect.objectContaining({ source: "/alternatives/clickup-alternatives", destination: "/reviews/clickup", permanent: true }),
      expect.objectContaining({ source: "/alternatives/grammarly-alternatives", destination: "/reviews/grammarly", permanent: true }),
    ]))
    for (const slug of ["clickup", "grammarly"]) {
      expect(getReview(slug), slug).not.toBeNull()
      expect(isContentAvailable("review", slug), slug).toBe(true)
      expect(isNoindexed("reviews", slug), slug).toBe(false)
    }
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
