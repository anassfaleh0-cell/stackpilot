import { describe, expect, it } from "vitest"
import { getVisibleEditorialFaqs } from "./review-faqs"

describe("getVisibleReviewFaqs", () => {
  it("removes broken generated fragments and exact generic filler", () => {
    const result = getVisibleReviewFaqs([
      { question: "What is the product best for?", answer: "It is best for block-based editor combines ." },
      { question: "Does it work offline?", answer: "Offline mode is unreliable for anyone with intermittent connect. This limitation affects teams with spotty coverage." },
      { question: "How do I choose?", answer: "The best choice depends on your team's specific workflow requirements and existing technology stack." },
      { question: "Does it support export?", answer: "The product supports CSV and JSON exports, so teams can move structured records to another system and validate the export before migration." },
    ])
    expect(result).toHaveLength(1)
    expect(result[0].question).toBe("Does it support export?")
  })

  it("deduplicates normalized questions and repeated answers", () => {
    const result = getVisibleReviewFaqs([
      { question: "Does it work offline?", answer: "Offline support is limited to pages that were previously downloaded. Test the behavior on each device before relying on it." },
      { question: "  DOES IT WORK OFFLINE? ", answer: "A different answer that is sufficiently detailed and complete to pass the basic content checks." },
      { question: "Can I use it offline?", answer: "Offline support is limited to pages that were previously downloaded. Test the behavior on each device before relying on it." },
    ])
    expect(result).toHaveLength(1)
  })

  it("respects the limit and handles invalid input safely", () => {
    const faqs = [
      { question: "How does export work?", answer: "Export options vary by workspace and plan. Run a small export first and verify attachments, permissions, and metadata before migrating." },
      { question: "How does billing work?", answer: "Billing may be monthly or annual depending on the plan. Confirm current prices and renewal terms on the vendor's pricing page." },
    ]
    expect(getVisibleReviewFaqs(faqs, 1)).toHaveLength(1)
    expect(getVisibleReviewFaqs(faqs, 0)).toEqual([])
    expect(getVisibleReviewFaqs(null as never)).toEqual([])
  })
})
