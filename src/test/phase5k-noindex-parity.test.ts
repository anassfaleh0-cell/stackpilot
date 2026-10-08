import { describe, it, expect } from "vitest"
import { isNoindexed } from "@/lib/noindex"
import { getComparison, getAlternative, getBest } from "@/lib/content/registry"
import { generateMetadata as comparisonMetadata, generateStaticParams as comparisonParams } from "@/app/comparisons/[slug]/page"
import { generateMetadata as alternativeMetadata } from "@/app/alternatives/[slug]/page"
import { generateMetadata as bestMetadata } from "@/app/best/[slug]/page"
import sitemap from "@/app/sitemap"

const params = (slug: string) => ({ params: Promise.resolve({ slug }) })

describe("content routes remain indexable while quality is fixed in place", () => {
  it("restores previously suppressed comparison URLs instead of returning 404", async () => {
    const slug = "activecampaign-vs-adobe-express"
    expect(getComparison(slug)).not.toBeNull()
    expect(isNoindexed("comparisons", slug)).toBe(false)
    expect(comparisonParams().length).toBeGreaterThan(900)
    expect(await comparisonMetadata(params(slug))).toMatchObject({
      robots: { index: true, follow: true },
    })
  })

  it("keeps previously suppressed alternatives indexable", async () => {
    const slug = "slack-alternatives"
    expect(getAlternative(slug)).not.toBeNull()
    expect(isNoindexed("alternatives", slug)).toBe(false)
    expect(await alternativeMetadata(params(slug))).toMatchObject({
      robots: { index: true, follow: true },
    })
  })

  it("keeps previously suppressed best pages indexable", async () => {
    const slug = "best-ai-machine-learning-agencies"
    expect(getBest(slug)).not.toBeNull()
    expect(isNoindexed("best", slug)).toBe(false)
    expect(await bestMetadata(params(slug))).toMatchObject({
      robots: { index: true, follow: true },
    })
  })

  it("contains recovered routes in the sitemap", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname)
    expect(paths).toContain("/comparisons/activecampaign-vs-adobe-express")
    expect(paths).toContain("/alternatives/slack-alternatives")
    expect(paths).toContain("/best/best-ai-machine-learning-agencies")
  })
})
