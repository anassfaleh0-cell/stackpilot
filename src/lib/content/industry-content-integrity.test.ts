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
    // Legal retains the archived legacy JSON while serving a reviewed buyer guide.
    expect(legal?.body).toContain("matter lifecycle")
    expect(legal?.body).not.toContain("Solutions Evaluated: 50+")
  })

  it.each([
    ["healthcare", "clinical systems"],
    ["finance", "financial workflow"],
    ["education", "learning and administration"],
    ["construction", "estimate to final cost"],
    ["retail", "order-to-cash"],
    ["legal", "matter lifecycle"],
  ])("serves sector-specific reviewed %s guide while preserving stored scores", (slug, phrase) => {
    const record = getIndustry(slug)
    expect(record?.body?.toLowerCase()).toContain(phrase)
    expect(record?.body).not.toContain("Solutions Evaluated: 50+")
    expect(record?.recommendations.length).toBeGreaterThanOrEqual(4)
    expect(record?.recommendations.every((r) => typeof r.rating === "number" && r.rating > 0)).toBe(true)
    expect(record?.lastUpdated).toBe("2026-10-30")
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
