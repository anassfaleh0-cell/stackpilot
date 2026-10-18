import { describe, it, expect } from "vitest"
import { getComparison, getReview, searchContent } from "@/lib/content/registry"

describe("searchContent", () => {
  it("returns results for matching query", () => {
    const results = searchContent("Notion")
    expect(results.reviews.length).toBeGreaterThan(0)
    expect(results.reviews[0].name).toBe("Notion")
  })

  it("returns empty arrays for unmatched query", () => {
    const results = searchContent("xyznonexistent12345")
    expect(results.reviews).toHaveLength(0)
    expect(results.comparisons).toHaveLength(0)
    expect(results.guides).toHaveLength(0)
    expect(results.glossary).toHaveLength(0)
    expect(results.blog).toHaveLength(0)
  })

  it("is case-insensitive", () => {
    const lower = searchContent("notion")
    const upper = searchContent("NOTION")
    expect(lower.reviews.length).toBe(upper.reviews.length)
  })

  it("matches across multiple content types", () => {
    const results = searchContent("SaaS")
    const total = results.reviews.length + results.comparisons.length +
      results.guides.length + results.glossary.length + results.blog.length
    expect(total).toBeGreaterThan(0)
  })
})

describe("getAllReviews", () => {
  it("returns all reviews sorted by rating", async () => {
    const { getAllReviews } = await import("@/lib/content/registry")
    const reviews = getAllReviews()
    expect(reviews.length).toBeGreaterThanOrEqual(6)
    for (let i = 1; i < reviews.length; i++) {
      expect(reviews[i - 1].rating).toBeGreaterThanOrEqual(reviews[i].rating)
    }
  })
})


describe("content quality safeguards", () => {
  it("does not render known generic filler in review sections", () => {
    const reviewSlugs = ["airtable", "amplitude", "clickup", "confluence", "deel", "hotjar", "intercom", "kubernetes"]
    const filler = [
      /most successful deployments follow a phased approach/i,
      /this topic is most useful when it is connected to a real decision/i,
      /choosing the right marketing\\s*&\\s*seo software/i,
      /adequate performance for most use cases\\./i,
      /functional organized interface\\./i,
      /written against our published editorial methodology/i,
      /updated when the underlying content is reviewed/i,
    ]
    for (const slug of reviewSlugs) {
      const review = getReview(slug)
      if (!review) continue
      const renderedText = review.content.map((section) => section.title + " " + section.body).join(" ")
      for (const pattern of filler) expect(renderedText).not.toMatch(pattern)
    }
  })

  it("does not publish a universal winner for cross-category products", () => {
    const comparison = getComparison("1password-vs-appwrite")
    expect(comparison).not.toBeNull()
    expect(comparison?.winner).toBeNull()
    expect(comparison?.verdict).toMatch(/different categories/i)
  })
})
