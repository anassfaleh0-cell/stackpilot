import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"
import { getComparison, getIndustry } from "./registry"

function source(folder: string, slug: string): Record<string, any> {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", folder, slug + ".json"), "utf8"))
}

describe("payment comparison evidence and historical preservation", () => {
  it("retains the historical Stripe pick as provisional, without fabricating a scored winner", () => {
    const original = source("comparisons", "stripe-vs-paddle")
    const comparison = getComparison("stripe-vs-paddle")
    expect(original.winner).toBe("Stripe")
    expect(original.winnerVerified).toBe(false)
    expect(original.decisionGuide).toBe(true)
    expect(comparison?.winner).toBe("Stripe")
    expect(comparison?.winnerVerified).toBe(false)
    expect(comparison?.featuresVerified).toBe(false)
    expect(comparison?.features).toHaveLength(10)
    expect(comparison?.verdict).toContain("Stripe Managed Payments")
    expect(comparison?.verdict).toContain("Paddle")
    expect(comparison?.verdict).not.toMatch(/99\.9%|we evaluated|13,000|4\.7\/5/i)
  })

  it("distinguishes standard Checkout, optional Managed Payments and Paddle's merchant-of-record scope", () => {
    const comparison = source("comparisons", "stripe-vs-paddle")
    expect(comparison.features.some((row: any) =>
      row.tool1Detail.includes("stripe.com/managed-payments") &&
      row.tool2Detail.includes("paddle.com"))).toBe(true)
    expect(comparison.features.some((row: any) => row.name === "Indirect tax responsibility")).toBe(true)
    expect(comparison.faqs[0].answer).toContain("Stripe also has Managed Payments")
    expect(comparison.verdict).not.toMatch(/\b(?:guaranteed winner|enterprise-grade compliance)\b/i)
  })

  it("serves the authored Ahrefs and Moz workflow verdict instead of repetitive fallback copy", () => {
    const sourceComparison = source("comparisons", "ahrefs-vs-moz")
    const displayed = getComparison("ahrefs-vs-moz")
    expect(sourceComparison.decisionGuide).toBe(true)
    expect(displayed?.verdict).toContain("Ahrefs and Moz overlap")
    expect(displayed?.verdict).toContain("client recommendation")
    expect(displayed?.features.some((row) =>
      row.tool1Detail?.includes("ahrefs.com/academy"))).toBe(true)
  })
})

describe("industry data safeguards and quality", () => {
  it.each(["healthcare", "finance", "education", "construction", "retail", "legal"])(
    "does not replace source-rated %s products with invented scores",
    (slug) => {
      const original = source("industries", slug)
      const actual = getIndustry(slug)
      expect(actual?.recommendations.map((item) => item.rating)).toEqual(
        original.recommendations.map((item: any) => item.rating),
      )
      expect(original.reviewedBody?.length).toBeGreaterThan(2000)
      expect(actual?.body).toContain("<article>")
      expect(actual?.body).not.toContain("Solutions Evaluated: 50+")
      if (original.body) expect(original.body).toContain("<article")
    },
  )
})
