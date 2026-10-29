import { describe, expect, it } from "vitest"
import { getIndustry, getReview } from "./registry"

describe("industry and software review editorial integrity", () => {
  it("restores the reviewed recruiting buyer guide without generic title replacement", () => {
    const recruiting = getIndustry("recruiting")
    expect(recruiting?.title).toContain("ATS, CRM")
    expect(recruiting?.description).toContain("candidate pipeline")
    expect(recruiting?.body).toContain("Map the hiring process")
    expect(recruiting?.lastUpdated).toBe("2026-10-24")
  })

  it("renders substantive reviewed industry guidance without serving broken legacy HTML", () => {
    const consulting = getIndustry("consulting")
    const marketing = getIndustry("marketing")
    const legal = getIndustry("legal")
    expect(consulting?.body).toContain("consulting engagement lifecycle")
    expect(consulting?.body).not.toContain("Solutions Evaluated: 50+")
    expect(marketing?.body).toContain("marketing tool stack")
    expect(marketing?.body).not.toContain("Solutions Evaluated: 50+")
    expect(consulting?.title).toContain("Engagement Delivery")
    expect(consulting?.lastUpdated).toBe("2026-10-29")
    // Legal legacy source remains in JSON, but cannot appear as malformed HTML.
    expect(legal?.body).toBeUndefined()
  })

  it.each([
    ["clickup", "help.clickup.com"],
    ["figma", "help.figma.com"],
    ["sketch", "sketch.com/docs"],
    ["github", "docs.github.com"],
    ["sourceforge", "sourceforge.net/create"],
  ])("keeps %s review ratings and source-specific documentation", (slug, primarySource) => {
    const review = getReview(slug)
    expect(review?.rating).toBeGreaterThan(0)
    expect(review?.content.some((part) => part.body.includes(primarySource))).toBe(true)
    const audience = (review as (typeof review & { whoShouldUse?: string }) | null)?.whoShouldUse || ""
    expect(audience).not.toMatch(/(?:5-200|more than 500 users|fast-growing startups)/i)
  })
})
