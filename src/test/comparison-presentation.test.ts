import { describe, expect, it } from "vitest"
import { getComparisonDescriptionForDisplay, getComparisonVerdictForDisplay, getSpecificComparisonFaqs } from "@/lib/content/comparison-presentation"

describe("comparison presentation avoids generic boilerplate", () => {
  it("replaces a clearly truncated description with a cautious useful summary", () => {
    const result = getComparisonDescriptionForDisplay(
      "Square vs Xero: Square helps retail teams, Xero is a cloud accounting platform, Xero.",
      "Square",
      "Xero",
    )
    expect(result).toContain("Compare their use cases")
    expect(result).toContain("Confirm current pricing")
    expect(result).not.toContain("cloud accounting platform, Xero.")
  })

  it("preserves a complete comparison description", () => {
    const description = "Compare Square and Xero across use cases, recorded features, and available plans."
    expect(getComparisonDescriptionForDisplay(description, "Square", "Xero")).toBe(description)
  })

  it("replaces imported overall-pick claims with a neutral evidence-led description", () => {
    const result = getComparisonDescriptionForDisplay(
      "Square vs Xero: Square is our overall pick for Finance & Accounting teams — Square 4.3/5, Xero 4.3/5.",
      "Square",
      "Xero",
    )
    expect(result).toContain("Compare their use cases")
    expect(result).toContain("Confirm current pricing")
    expect(result).not.toContain("overall pick")
  })

  it("replaces a template verdict with a transparent evidence limitation", () => {
    const result = getComparisonVerdictForDisplay(
      "After thorough evaluation, Square emerges as our recommendation. We recommend evaluating both tools against your requirements.",
      false,
    )
    expect(result).toContain("does not provide enough product-specific evidence")
    expect(result).not.toContain("emerges as our recommendation")
  })

  it("explains category differences without claiming a winner", () => {
    const result = getComparisonVerdictForDisplay("Based on the recorded comparison criteria, A wins.", true)
    expect(result).toContain("different categories")
    expect(result).toContain("does not provide enough product-specific evidence")
  })

  it("preserves specific FAQs and removes generic template answers", () => {
    const result = getSpecificComparisonFaqs([
      { question: "What are the main differences?", answer: "Our comparison table breaks down these differences." },
      { question: "What does the free plan include?", answer: "The free plan includes two seats and basic reporting." },
      { question: "Which is better?", answer: "Based on the recorded comparison criteria, both platforms offer strong features." },
    ])
    expect(result).toEqual([
      { question: "What does the free plan include?", answer: "The free plan includes two seats and basic reporting." },
    ])
  })

  it("filters malformed self-referential FAQ copy found in imported records", () => {
    const result = getSpecificComparisonFaqs([
      { question: "Which tool is better?", answer: "Square excels at Square is a finance platform, while Xero is stronger for Xero is a cloud accounting platform." },
      { question: "How much does it cost?", answer: "Square starts at Free – $79/mo while Xero starts at $13–$45/mo. Confirm the current plan prices with each vendor." },
    ])
    expect(result).toEqual([])
  })

  it("filters malformed questions, duplicate questions, and empty or oversized answers", () => {
    const result = getSpecificComparisonFaqs([
      { question: "What does the free plan include?", answer: "The free plan includes two seats and basic reporting for small teams that need a simple starting point." },
      { question: "What does the free plan include?", answer: "The free plan includes two seats and basic reporting for small teams that need a simple starting point." },
      { question: "This is not a question", answer: "A sufficiently detailed answer that should not be published because the question is malformed." },
      { question: "What is included in the paid plan?", answer: "" },
      { question: "What is included in enterprise?", answer: "x".repeat(701) },
    ])
    expect(result).toEqual([
      { question: "What does the free plan include?", answer: "The free plan includes two seats and basic reporting for small teams that need a simple starting point." },
    ])
  })

  it("collapses whitespace before deduplicating and rendering FAQs", () => {
    const result = getSpecificComparisonFaqs([
      { question: "  What   does the free plan include?  ", answer: "  The free plan includes two seats   and basic reporting for small teams that need a simple starting point.  " },
      { question: "What does the free plan include?", answer: "The free plan includes two seats and basic reporting for small teams that need a simple starting point." },
    ])
    expect(result).toEqual([
      { question: "What does the free plan include?", answer: "The free plan includes two seats and basic reporting for small teams that need a simple starting point." },
    ])
  })

  it("does not publish an unsupported stored dataset winner as an editorial verdict", () => {
    const result = getComparisonVerdictForDisplay(
      "Square is the recorded winner in the PilotStack comparison dataset.",
      false,
    )
    expect(result).toContain("does not provide enough product-specific evidence")
    expect(result).not.toContain("recorded winner")
  })

  it("filters contradictory unsupported winners and numeric ratings from comparison FAQs", () => {
    const result = getSpecificComparisonFaqs([
      { question: "Which tool is better, Square or Xero?", answer: "Based on the recorded comparison criteria, Square edges ahead with a 4.3/5 rating. Square excels at retail, while Xero is stronger for accounting." },
      { question: "How much does Square cost?", answer: "Square starts at Free while Xero pricing not independently verified. Confirm current pricing with each vendor before choosing." },
      { question: "Can I use both tools together?", answer: "You can evaluate whether the two products work together by confirming their current integrations, export options, and the tasks your team needs to complete before choosing a workflow." },
    ])
    expect(result).toEqual([
      { question: "Can I use both tools together?", answer: "You can evaluate whether the two products work together by confirming their current integrations, export options, and the tasks your team needs to complete before choosing a workflow." },
    ])
  })

  it("preserves non-template verdicts", () => {
    const verdict = "Choose A if you need an offline-first workflow; choose B for managed collaboration."
    expect(getComparisonVerdictForDisplay(verdict, false)).toBe(verdict)
  })
})
