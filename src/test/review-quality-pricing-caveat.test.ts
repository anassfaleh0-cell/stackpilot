import { describe, expect, it } from "vitest"
import { stripUnverifiedPriceClaims } from "@/lib/content/review-quality"

describe("unverified pricing caveats", () => {
  it("replaces exact unverified price sentences with useful verification guidance", () => {
    const result = stripUnverifiedPriceClaims(
      "Professional costs $12/editor/month. Enterprise costs $75/editor/month. Annual billing may change the total."
    )
    expect(result).not.toContain("$12/editor/month")
    expect(result).not.toContain("$75/editor/month")
    expect(result.match(/Current pricing and plan entitlements are not independently verified/gi)).toHaveLength(1)
    expect(result).toContain("Annual billing may change the total.")
  })

  it("does not mistake unrelated historical financial figures for product pricing", () => {
    const result = stripUnverifiedPriceClaims(
      "The proposed acquisition was valued at $20 billion in 2022."
    )
    expect(result).not.toContain("Pricing and plan details")
  })

  it("removes an exact price even when old copy already carries a caveat", () => {
    const result = stripUnverifiedPriceClaims(
      "Pro starts at $12.99/month; this price is not independently verified."
    )
    expect(result).not.toContain("$12.99")
    expect(result).toContain("Current pricing and plan entitlements are not independently verified")
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
