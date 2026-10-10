import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const slugs = ["best-ai-coding-tools", "best-ai-image-generators", "best-agile-project-management", "best-error-tracking", "best-ai-video-tools", "best-ci-cd-tools"]

describe("shortlist content integrity", () => {
  it("does not present unverified prices or ratings as independently confirmed", () => {
    for (const slug of slugs) {
      const file = path.join(process.cwd(), "content", "best", `${slug}.json`)
      const page = JSON.parse(fs.readFileSync(file, "utf8")) as {
        description: string
        pricingSummary: string
        picks: Array<{ priceRange?: string; bestFor?: string }>
        comparisonTable?: { rows?: string[][] }
      }

      expect(page.description).toMatch(/not independently verified/i)
      expect(page.pricingSummary).toMatch(/not independently verified/i)
      expect(page.picks.length).toBeGreaterThan(0)
      expect(page.comparisonTable?.rows?.length).toBe(page.picks.length)
      for (const row of page.comparisonTable?.rows ?? []) {
        expect(row[1]).toMatch(/not independently verified/i)
        expect(row[2]).toMatch(/not independently verified/i)
      }
      for (const pick of page.picks) {
        expect(pick.priceRange).toMatch(/not independently verified/i)
        expect(pick.bestFor).not.toMatch(/is perfect for|is ideal for/i)
      }
    }
  })

  it("does not imply an unverified overall ranking in shortlist presentation", () => {
    const template = fs.readFileSync(path.join(process.cwd(), "src/app/best/[slug]/page.tsx"), "utf8")
    expect(template).toContain("not a verified overall ranking")
    expect(template).toContain("The list order is not a verified ranking.")
    expect(template).toContain("Options to Evaluate")
    expect(template).not.toContain("#1 listed option")
    expect(template).not.toContain(">Top Picks</h2>")
    expect(template).not.toContain("{pick.rank}</span>")
  })
})
