import { describe, expect, it } from "vitest"
import { stripUnverifiedPriceClaims } from "@/lib/content/review-quality"

describe("unverified pricing caveats", () => {
  it("adds one pricing caveat per content field rather than after every price sentence", () => {
    const result = stripUnverifiedPriceClaims(
      "Professional costs $12/editor/month. Enterprise costs $75/editor/month. Annual billing may change the total."
    )
    expect(result.match(/not independently verified/gi)).toHaveLength(1)
    expect(result).toContain("Professional costs $12/editor/month")
    expect(result).toContain("Enterprise costs $75/editor/month")
  })

  it("does not mistake unrelated historical financial figures for product pricing", () => {
    const result = stripUnverifiedPriceClaims(
      "The proposed acquisition was valued at $20 billion in 2022."
    )
    expect(result).not.toContain("Pricing and plan details")
  })

  it("does not add a second caveat when pricing is already marked for verification", () => {
    const result = stripUnverifiedPriceClaims(
      "Pricing is not independently verified; confirm current pricing with the vendor."
    )
    expect(result.match(/not independently verified/gi)).toHaveLength(1)
  })

  it("preserves the text and adds a single caveat for a plan claim without an exact price", () => {
    const result = stripUnverifiedPriceClaims(
      "The free plan may be suitable for an initial pilot."
    )
    expect(result).toContain("The free plan may be suitable")
    expect(result.match(/not independently verified/gi)).toHaveLength(1)
  })
})
