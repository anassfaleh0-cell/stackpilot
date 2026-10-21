import { describe, it, expect } from "vitest"
import { searchContent } from "@/lib/content/registry"

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
  it("sorts verified ratings first without ranking unverified records by unsupported scores", async () => {
    const { getAllReviews } = await import("@/lib/content/registry")
    const reviews = getAllReviews()
    expect(reviews.length).toBeGreaterThanOrEqual(6)

    const firstUnverified = reviews.findIndex((review) =>
      review.ratingVerified !== true || typeof review.rating !== "number" || !Number.isFinite(review.rating)
    )
    const verified = reviews.filter((review) =>
      review.ratingVerified === true && typeof review.rating === "number" && Number.isFinite(review.rating)
    )

    for (let i = 1; i < verified.length; i++) {
      expect(verified[i - 1].rating).toBeGreaterThanOrEqual(verified[i].rating)
    }
    if (firstUnverified >= 0) {
      expect(reviews.slice(firstUnverified).every((review) =>
        review.ratingVerified !== true || typeof review.rating !== "number" || !Number.isFinite(review.rating)
      )).toBe(true)
    }
  })
})
