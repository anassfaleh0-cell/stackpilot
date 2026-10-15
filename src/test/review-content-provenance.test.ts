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
    expect(content[0].body).not.toMatch(/\\$29/)
    const faqs = getVisibleReviewFaqs([{ question: "How much does it cost?", answer: "Pricing starts at $29/month." }], false)
    expect(faqs[0].answer).not.toMatch(/\\$29/)
  })

  it("shows diagrams only when the corresponding evidence flag is set", () => {
    const visible = getVisibleReviewContent(diagrams, true, true)
    expect(visible.map((section) => section.body)).toEqual(["pricing-ladder", "feature-radar", "implementation-flow"])
  })
})
