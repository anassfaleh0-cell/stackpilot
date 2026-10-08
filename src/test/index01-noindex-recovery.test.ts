import { describe, it, expect } from "vitest"
import { isNoindexed } from "@/lib/noindex"
import { getContentTitle } from "@/lib/content/registry"
import sitemap from "@/app/sitemap"
import { metadata as searchMetadata } from "@/app/search/page"
import { metadata as dashboardMetadata } from "@/app/dashboard/page"

const SITE = "https://www.pilotstack.online"

describe("site-wide content indexability policy", () => {
  it("does not noindex real content records", () => {
    const samples = [
      ["reviews", "linear"],
      ["reviews", "affinity"],
      ["comparisons", "ahrefs-vs-moz"],
      ["comparisons", "activecampaign-vs-adobe-express"],
      ["guides", "agile-transformation-guide"],
      ["glossary", "dashboard"],
      ["alternatives", "slack-alternatives"],
      ["best", "best-crm-software"],
      ["use-cases", "best-crm-for-small-business"],
      ["industries", "telecommunications"],
      ["research", "saas-pricing-benchmark-2026"],
      ["statistics", "blockchain-software"],
      ["hubs", "software-for-startups"],
      ["blog", "content-marketing-platforms"],
    ] as const
    for (const [dir, slug] of samples) {
      const type = dir === "use-cases" ? "use-case" : dir === "alternatives" ? "alternative" : dir === "comparisons" ? "comparison" : dir === "reviews" ? "review" : dir === "best" ? "best" : dir === "guides" ? "guide" : dir === "statistics" ? "statistic" : dir === "industries" ? "industry" : dir === "research" ? "research" : dir === "hubs" ? "hub" : "blog"
      expect(getContentTitle(type, slug)).not.toBeNull()
      expect(isNoindexed(dir, slug)).toBe(false)
    }
  })

  it("keeps real content discoverable in the sitemap", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname)
    for (const path of [
      "/reviews/linear",
      "/comparisons/ahrefs-vs-moz",
      "/comparisons/activecampaign-vs-adobe-express",
      "/guides/agile-transformation-guide",
      "/glossary/dashboard",
      "/alternatives/slack-alternatives",
      "/best/best-crm-software",
      "/use-cases/best-crm-for-small-business",
    ]) {
      expect(paths, path).toContain(path)
    }
  })

  it("does not let utility pages become indexable", () => {
    expect((searchMetadata as { robots?: unknown }).robots).toMatchObject({ index: false, follow: false })
    expect((dashboardMetadata as { robots?: unknown }).robots).toMatchObject({ index: false, follow: false })
  })

  it("keeps the public editorial team author page indexable", async () => {
    const { isPublicAuthor } = await import("@/lib/authors")
    const { generateMetadata } = await import("@/app/authors/[slug]/page")
    expect(isPublicAuthor("pilotstack-team")).toBe(true)
    const meta = await generateMetadata({ params: Promise.resolve({ slug: "pilotstack-team" }) })
    expect((meta as { robots?: { index?: boolean; follow?: boolean } }).robots).toMatchObject({ index: true, follow: true })
  })

  it("uses the canonical www host in sitemap URLs", () => {
    const paths = sitemap()
    expect(paths.length).toBeGreaterThan(0)
    for (const entry of paths.slice(0, 20)) expect(entry.url.startsWith(SITE)).toBe(true)
  })
})
