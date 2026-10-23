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
    expect(stripUnverifiedPriceClaims("Plan starts at $29/month")).toContain("Plan starts at $29/month")
    expect(stripUnverifiedPriceClaims("Plan starts at $29/month")).toContain("not independently verified")
    const content = getVisibleReviewContent([{ title: "Overview", body: "The plan starts at $29/month." }], false)
    expect(content[0].body).toContain("$29")
    expect(content[0].body).toContain("not independently verified")
    const faqs = getVisibleReviewFaqs([
      { question: "How much does it cost?", answer: "Pricing starts at $29/month." },
      { question: "What is the annual price?", answer: "The annual plan costs 120 GBP/year." },
      { question: "Is there a per-user rate?", answer: "The vendor lists 49 EUR per user." },
    ], false)
    expect(faqs[0].answer).toContain("$29")
    expect(faqs[0].answer).toContain("not independently verified")
    expect(faqs[1].answer).toContain("120 GBP")
    expect(faqs[1].answer).toContain("not independently verified")
    expect(faqs[2].answer).toContain("49 EUR")
    expect(faqs[2].answer).toContain("not independently verified")
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
      expect(stripUnverifiedPriceClaims(claim)).toContain(claim.replace(/^A /, ""))
      expect(stripUnverifiedPriceClaims(claim)).toContain("not independently verified")
    }

    expect(stripUnverifiedPriceClaims("Includes a free trial")).toContain("Includes a free trial")
    expect(stripUnverifiedPriceClaims("Includes a free trial")).toContain("not independently verified")
    expect(stripUnverifiedPriceClaims("The free plan is suitable for testing")).toContain("The free plan is suitable for testing")
    expect(stripUnverifiedPriceClaims("The free plan is suitable for testing")).toContain("not independently verified")
    expect(stripUnverifiedPriceClaims("A freemium tier is available")).toContain("A freemium tier is available")
    expect(stripUnverifiedPriceClaims("A freemium tier is available")).toContain("not independently verified")
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
    expect(faqs[0].answer).toContain("$29")
    expect(faqs[0].answer).toContain("not independently verified")
    expect(faqs[1].answer).toContain("compare the current feature set")
  })

  it("shows diagrams only when the corresponding evidence flag is set", () => {
    const visible = getVisibleReviewContent(diagrams, true, true)
    expect(visible.map((section) => section.body)).toEqual(["pricing-ladder", "feature-radar", "implementation-flow"])
  })
  it("does not render duplicate top-level Quick Answer or TL;DR sections in the body", () => {
    const sections = [
      { title: "Quick Answer", body: "Repeated quick answer", type: "text" as const },
      { title: "TL;DR", body: "Repeated summary", type: "text" as const },
      { title: "Feature Evaluation", body: "Specific evaluation guidance", type: "text" as const },
    ]
    expect(getVisibleReviewContent(sections).map((section) => section.title)).toEqual(["Feature Evaluation"])
  })

  it("hides product-specific capability FAQs until feature provenance is verified", () => {
    const faqs = [
      { question: "Does Linear integrate with GitHub?", answer: "Yes, Linear offers deep GitHub integration that allows teams to link issues to branches, pull requests, and commits." },
      { question: "What are the main features of Linear?", answer: "Linear supports issue tracking, project planning, and custom workflows." },
      { question: "Who should evaluate Linear?", answer: "Teams should compare the workflow against their requirements before choosing." },
    ]
    expect(getVisibleReviewFaqs(faqs).map((faq) => faq.question)).toEqual(["Who should evaluate Linear?"])
  })

})
