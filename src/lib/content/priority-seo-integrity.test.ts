import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

function sourceRecord<T>(directory: string, slug: string): T {
  const filePath = path.join(process.cwd(), "content", directory, `${slug}.json`)
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T
}

describe("high-value editorial recovery sources", () => {
  it("retains the original agency SEO long-form buyer guide", () => {
    const agency = sourceRecord<{ body?: string; recommendations?: unknown[]; selectionCriteria?: unknown[] }>(
      "use-cases", "best-seo-for-agencies",
    )
    expect(agency.body?.length).toBeGreaterThan(2500)
    expect(agency.body).toMatch(/Ahrefs/i)
    expect(agency.body).toMatch(/Semrush/i)
    expect(agency.body).toMatch(/Moz/i)
    expect(agency.selectionCriteria?.length).toBeGreaterThanOrEqual(3)
    expect(agency.recommendations?.length).toBeGreaterThanOrEqual(3)
  })

  it("preserves the enterprise SEO analysis instead of replacing it with generic copy", () => {
    const enterprise = sourceRecord<{ body?: string; criteria?: unknown[]; picks?: unknown[] }>(
      "best", "best-marketing-seo-enterprise",
    )
    expect(enterprise.body?.length).toBeGreaterThan(3500)
    expect(enterprise.criteria?.length).toBeGreaterThanOrEqual(5)
    expect(enterprise.picks?.length).toBeGreaterThanOrEqual(3)
    expect(enterprise.body).toMatch(/technical/i)
  })

  it("keeps SourceForge's provisional score while linking specific verified feature evidence", () => {
    const review = sourceRecord<{
      rating?: number; ratingVerified?: boolean; featuresVerified?: boolean;
      features?: Array<{ name: string; available: boolean; description: string }>;
    }>("reviews", "sourceforge")
    expect(typeof review.rating).toBe("number")
    expect(review.ratingVerified).toBe(false)
    expect(review.featuresVerified).toBe(true)
    expect(review.features?.length).toBeGreaterThanOrEqual(5)
    expect(review.features?.every((feature) =>
      feature.available === true && feature.description.includes("https://sourceforge.net/create/"),
    )).toBe(true)
  })
})
