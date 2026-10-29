import { describe, expect, it } from "vitest"
import { getVisibleReviewContent, getVisibleReviewFaqs } from "@/lib/content/review-quality"

describe("sourced review FAQ visibility", () => {
  it("retains a vendor-cited, qualified feature answer when the feature matrix is provisional", () => {
    const sourceFaq = {
      question: "Does Jotform support conditional form questions?",
      answer: "Jotform documents conditional fields. Test your logic before launch. Official source: https://www.jotform.com/help/57-smart-forms-conditional-logic-for-online-forms/.",
    }
    const visible = getVisibleReviewFaqs([sourceFaq], false, false)
    expect(visible).toHaveLength(1)
    expect(visible[0].answer).toContain("Official source")
  })

  it("keeps source-free feature promises hidden when the claims are not independently verified", () => {
    const unsupported = {
      question: "Does ExampleTool support SSO?",
      answer: "Yes, every plan includes enterprise-grade SSO and universal security compliance without any limitations.",
    }
    expect(getVisibleReviewFaqs([unsupported], false, false)).toHaveLength(0)
  })

  it("retains a general buyer question that transparently requests confirmation", () => {
    const buyerQuestion = {
      question: "What should a Jotform user test before launch?",
      answer: "Test form quotas, stored submissions, upload limits, notification routing and exports for the intended plan.",
    }
    expect(getVisibleReviewFaqs([buyerQuestion], false, false)).toHaveLength(1)
  })
})


describe("review section fallback quality", () => {
  const unsupportedLegacyClaim =
    "Xero earns a 4.2/5 rating. Best for teams that need reliable accounting capabilities with strong feature coverage."

  it("replaces unsupported strengths and audience claims with actionable, section-specific guidance", () => {
    const sections = getVisibleReviewContent([
      { title: "Recorded strengths and trade-offs", body: unsupportedLegacyClaim },
      { title: "Who should evaluate this tool", body: unsupportedLegacyClaim },
    ], false, false, "Xero")

    expect(sections).toHaveLength(2)
    expect(sections[0].body).toContain("Treat any listed strength of Xero as a hypothesis")
    expect(sections[0].body).toContain("failure cases")
    expect(sections[1].body).toContain("Assess Xero against the team's actual workflow")
    expect(sections.every((section) => !section.body.includes("This section needs product-specific evidence"))).toBe(true)
  })

  it("keeps unknown claims transparent without repeating a generic placeholder across unrelated sections", () => {
    const sections = getVisibleReviewContent([
      { title: "Feature coverage to verify", body: "Xero delivers the core functionality expected from a platform in its category" },
      { title: "Decision record", body: "Xero earns a 4.2/5 rating. Best for teams that need reliable accounting capabilities with strong feature coverage." },
      { title: "Other considerations", body: "Xero earns a 4.2/5 rating. Best for teams that need reliable accounting capabilities with strong feature coverage." },
    ], false, false, "Xero")

    expect(sections[0].body).toContain("Treat the recorded capability notes for Xero as a checklist")
    expect(sections[1].body).toContain("acceptance plan for Xero")
    expect(sections[2].body).toContain("evaluate “Other considerations”")
    expect(sections.every((section) => !section.body.includes("This section needs product-specific evidence"))).toBe(true)
  })
})
