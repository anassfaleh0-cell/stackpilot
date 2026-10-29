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

  it.each(["best-remote-work-tools", "best-prototyping-tools"])(
    "retains practical criteria and article text in %s",
    (slug) => {
      const guide = sourceRecord<{
        body?: string; criteria?: string[]; comparisonTable?: { columns: string[]; rows: string[][] };
      }>("best", slug)
      expect(guide.criteria?.length).toBeGreaterThanOrEqual(6)
      expect(guide.criteria?.every((criterion) => criterion.length >= 60)).toBe(true)
      expect(String(guide.body).replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length).toBeGreaterThan(350)
      expect(guide.comparisonTable?.columns).toContain("Rating")
      expect(guide.comparisonTable?.rows.length).toBeGreaterThanOrEqual(5)
    },
  )

  it.each(["best-seo-for-startups", "best-marketing-for-enterprise"])(
    "publishes reviewed buyer guidance while preserving the original use-case article for %s",
    (slug) => {
      const record = sourceRecord<{
        body?: string; reviewedBody?: string; recommendations?: Array<{ rating?: number }>;
      }>("use-cases", slug)
      expect(record.body?.length).toBeGreaterThan(2000)
      expect(record.reviewedBody?.length).toBeGreaterThan(2200)
      expect(record.reviewedBody).toContain("third-party")
      expect(record.recommendations?.every((r) => typeof r.rating === "number")).toBe(true)
    },
  )

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
