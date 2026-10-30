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


describe("unsupported review metrics", () => {
  it("does not render unsourced latency, adoption, or compliance claims from legacy review records", () => {
    const review = getReview("supabase")
    expect(review).not.toBeNull()
    const renderedText = JSON.stringify({
      pros: review?.pros,
      cons: review?.cons,
      content: review?.content,
      faqs: review?.faqs,
    })
    expect(renderedText).not.toMatch(/40\+ native extensions|20\+ OAuth providers|100ms latency|500ms-2s|Documentation trails rapid releases by 2-3 months|complies with GDPR and CCPA/i)
  })
})

describe("comparison normalization", () => {
  it("preserves authored decision criteria instead of appending synthetic placeholder rows", () => {
    const comparison = getComparison("square-vs-xero")
    expect(comparison).not.toBeNull()
    expect(comparison?.features.map((feature) => feature.name)).toEqual([
      "Primary use",
      "Workflow fit",
      "Operations and risk",
      "Cost and decision",
    ])
    expect(comparison?.features.some((feature) => feature.name === "Recorded rating")).toBe(false)
    expect(comparison?.features.some((feature) => feature.name === "Pricing information")).toBe(false)
    expect(comparison?.features.some((feature) => String(feature.tool1).includes("0/5") || String(feature.tool2).includes("0/5"))).toBe(false)
  })
})

describe("evidence-safe comparison records", () => {
  it("does not publish a winner or score for the GitHub vs SourceForge decision guide", () => {
    const comparison = getComparison("github-vs-sourceforge")
    expect(comparison).not.toBeNull()
    expect(comparison?.winner).toBeNull()
    expect(comparison?.winnerVerified).toBe(false)
    expect(comparison?.featuresVerified).toBe(true)
    expect(comparison?.features).toHaveLength(8)
    expect(comparison?.description).not.toMatch(/4\.7\/5|3\.5\/5|\$19\.25/)
    expect(comparison?.verdict).not.toMatch(/(?:is the|our|the confirmed|a clear) overall winner|outperforms|4\.7\/5|3\.5\/5/i)
  })
})

