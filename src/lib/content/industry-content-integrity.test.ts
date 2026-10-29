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

  it("does not publish broken bulk-generated industry HTML or invent a revision date", () => {
    const consulting = getIndustry("consulting")
    expect(consulting?.body).toBeUndefined()
    expect(consulting?.title).toContain("Consulting Software")
    expect(consulting?.description).toContain("Client and engagement")
    expect(consulting?.lastUpdated).toBe("2026-08-11")
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
    expect(review?.whoShouldUse).not.toMatch(/(?:5-200|more than 500 users|fast-growing startups)/i)
  })
})
