import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

function readPage(relativePath: string): string {
  return fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")
}

describe("editorial provenance disclosures", () => {
  it("explains source provenance and evidence limits for numeric claims", () => {
    const methodology = readPage("src/app/methodology/page.tsx")
    const evaluationProcess = readPage("src/app/how-we-test-software/page.tsx")
    const about = readPage("src/app/about/page.tsx")
    const team = readPage("src/app/team/page.tsx")
    const policy = readPage("src/app/editorial-policy/page.tsx")

    expect(methodology).toMatch(/source URL, date checked, and relevant context must be recorded|source provenance/i)
    expect(evaluationProcess).toMatch(/checkable source|source verification|provenance/i)
    expect(about).toMatch(/source and calculation can be checked|source provenance/i)
    expect(team).toMatch(/source verification|source-provenance/i)
    expect(policy).toMatch(/source provenance and calculation can be checked|checkable source/i)
  })

  it("labels stored scores as provisional and keeps them out of verified-only ranking/schema logic", () => {
    const reviewPage = readPage("src/app/reviews/[slug]/page.tsx")

    expect(reviewPage).toContain('const hasStoredEditorialRating = typeof tool.rating === "number" && Number.isFinite(tool.rating) && tool.rating > 0')
    expect(reviewPage).toContain('const hasEditorialRating = tool.ratingVerified === true && hasStoredEditorialRating')
    expect(reviewPage).toContain('const categoryRatings = Array.isArray(tool.ratings) ? tool.ratings.filter((item) => typeof item.score === "number" && Number.isFinite(item.score) && item.score > 0) : []')
    expect(reviewPage).toContain('title="Editorial Score"')
    expect(reviewPage).toContain('"Assessment not yet recorded; no number is invented"')
    expect(reviewPage).toContain('"Provisional stored score; evidence audit pending"')
  })

  it("avoids blanket claims that every legacy score is already verified", () => {
    const evaluationProcess = readPage("src/app/how-we-test-software/page.tsx")
    const team = readPage("src/app/team/page.tsx")
    const about = readPage("src/app/about/page.tsx")

    expect(evaluationProcess).not.toContain("Ratings are arithmetic you can check on any review page")
    expect(evaluationProcess).not.toContain("Every page carries a last-reviewed date")
    expect(team).not.toContain("the process behind every score is public")
    expect(about).not.toContain("See exactly how we reach every conclusion")
  })
  
  it("preserves legacy review data while keeping unsupported claims provisional", () => {
    const slugs = ["chatgpt", "claude", "gemini", "linear", "notion", "perplexity"]
    for (const slug of slugs) {
      const page = JSON.parse(readPage(`content/reviews/${slug}.json`)) as {
        rating?: number | null
        reviewCount?: number | null
        ratings?: Array<{ score?: number }>
        ratingVerified?: boolean
        reviewCountVerified?: boolean
        ratingsVerified?: boolean
        priceRange?: string
        priceRangeVerified?: boolean
        company?: Record<string, unknown>
        companyFactsVerified?: boolean
      }

      if (page.ratingVerified === false && typeof page.rating === "number" && page.rating > 0) {
        expect(page.rating).toBeGreaterThanOrEqual(0)
        expect(page.rating).toBeLessThanOrEqual(5)
      }
      if (page.reviewCountVerified === false && typeof page.reviewCount === "number") {
        expect(page.reviewCount).toBeGreaterThanOrEqual(0)
      }
      if (page.ratingsVerified === false) {
        for (const item of page.ratings ?? []) {
          expect(item.score).toBeGreaterThanOrEqual(0)
          expect(item.score).toBeLessThanOrEqual(5)
        }
      }
      if (page.priceRangeVerified === false && page.priceRange) {
        expect(page.priceRange).toMatch(/not independently verified/i)
      }
      if (page.companyFactsVerified === false) {
        expect(page.company).toBeDefined()
      }
    }
  })

})
