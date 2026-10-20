import { describe, expect, it } from "vitest"
import { getVisibleReviewContent, getVisibleReviewFaqs, stripUnverifiedPriceClaims } from "@/lib/content/review-quality"

describe("review content provenance", () => {
  const diagrams = [
    { title: "Pricing ladder", body: "pricing-ladder", type: "diagram" as const },
    { title: "Feature radar", body: "feature-radar", type: "diagram" as const },
    { title: "Implementation flow", body: "implementation-flow", type: "diagram" as const },
  ]

  it("hides pricing and rating diagrams until their provenance is verified", () => {
    const visible = getVisibleReviewContent(diagrams, false, false)
    expect(visible.map((section) => section.body)).toEqual(["implementation-flow"])
  })

  it("removes currency claims from visible review copy until pricing is verified", () => {
    expect(stripUnverifiedPriceClaims("Plan starts at $29/month")).toBe("Plan pricing not independently verified")
    const content = getVisibleReviewContent([{ title: "Overview", body: "The plan starts at $29/month." }], false)
    expect(content[0].body).not.toContain("$29")
    const faqs = getVisibleReviewFaqs([{ question: "How much does it cost?", answer: "Pricing starts at $29/month." }], false)
    expect(faqs[0].answer).not.toContain("$29")
  })

  it("sanitizes unverified prices across currencies and common plan labels", () => {
    for (const claim of [
      "Starts at €49/month",
      "From £1,200/year",
      "A $29 per seat plan",
      "USD 29/month",
      "49 EUR per user",
      "120 GBP/year",
    ]) {
      expect(stripUnverifiedPriceClaims(claim)).not.toMatch(/[$€£]\s?\d|\b(?:USD|EUR|GBP)\s?\d|\b\d[\d,]*(?:\.\d+)?\s?(?:USD|EUR|GBP)\b/i)
    }

    expect(stripUnverifiedPriceClaims("Includes a free trial")).toContain("trial availability not independently verified")
    expect(stripUnverifiedPriceClaims("The free plan is suitable for testing")).toContain("plan availability not independently verified")
    expect(stripUnverifiedPriceClaims("A freemium tier is available")).toContain("plan availability not independently verified")
  })

  it("filters generated security/compliance FAQ claims and sanitizes pricing in remaining FAQs", () => {
    const faqs = getVisibleReviewFaqs([
      {
        question: "Is Example secure?",
        answer: "Example maintains SOC 2 Type II certifications. Check the vendor's current security documentation for details.",
      },
      {
        question: "Is Example GDPR compliant?",
        answer: "Yes, Example is GDPR compliant with data processing agreements and data residency options.",
      },
      {
        question: "How much does Example cost?",
        answer: "Plans start at $29/month; confirm current pricing with the vendor.",
      },
      {
        question: "Who should evaluate Example?",
        answer: "Teams should compare the current feature set against their requirements before choosing.",
      },
    ])

    expect(faqs).toHaveLength(2)
    expect(faqs[0].answer).not.toContain("$29")
    expect(faqs[0].answer).toContain("pricing not independently verified")
    expect(faqs[1].answer).toContain("compare the current feature set")
  })

  it("shows diagrams only when the corresponding evidence flag is set", () => {
    const visible = getVisibleReviewContent(diagrams, true, true)
    expect(visible.map((section) => section.body)).toEqual(["pricing-ladder", "feature-radar", "implementation-flow"])
  })
})
