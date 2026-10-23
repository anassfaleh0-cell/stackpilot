import { describe, expect, it } from "vitest"
import { sanitizeUnsupportedClaims } from "@/lib/content/registry"
import { getSafeStatisticNarrative } from "@/lib/content/statistic-narrative"

describe("unsupported editorial claim suppression", () => {
  it("removes unsupported certification and audit assertions", () => {
    const result = sanitizeUnsupportedClaims(
      "ExampleApp is SOC 2 Type II certified and publishes independent security audits annually. Check the vendor's current trust documentation before relying on a compliance claim.",
    )
    expect(result).not.toMatch(/SOC\s?2|independent security audits/i)
    expect(result).toMatch(/Check the vendor's current trust documentation/i)
  })

  it("removes unsupported scale and customer-count claims", () => {
    const result = sanitizeUnsupportedClaims(
      "ExampleApp is used by 150,000 businesses worldwide. Verify current customer information in the vendor's official materials.",
    )
    expect(result).not.toMatch(/150,000 businesses/i)
    expect(result).toMatch(/Verify current customer information/i)
  })

  it("removes illustrative customer outcomes that are presented as real case studies", () => {
    const result = sanitizeUnsupportedClaims(
      "A 400-person law firm uses ExampleApp and reduced admin time by 30%. Buyers should validate expected outcomes with a controlled pilot.",
    )
    expect(result).not.toMatch(/400-person law firm|reduced admin time by 30%/i)
    expect(result).toMatch(/Buyers should validate expected outcomes/i)
  })
  it("replaces unaudited statistics narratives instead of publishing unsupported figures", () => {
    const original = "The market is $50B+ and growing 26% year over year, with 4,874+ adopting organizations."
    const safe = getSafeStatisticNarrative("Market Size", "Data Privacy", original, false)

    expect(safe).not.toMatch(/\$50B|26%|4,874\+/)
    expect(safe).toMatch(/Data Privacy software/i)
    expect(safe).toMatch(/geography, currency, and publication date/i)
  })

  it("preserves the original narrative only when its source audit is complete", () => {
    const original = "Verified source-backed market definition."
    expect(getSafeStatisticNarrative("Market Size", "Data Privacy", original, true)).toBe(original)
  })

})
