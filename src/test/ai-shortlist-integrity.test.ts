import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const slugs = ["best-ai-coding-tools", "best-ai-image-generators", "best-agile-project-management"]

describe("AI shortlist content integrity", () => {
  it("does not present unverified prices or ratings as independently confirmed", () => {
    for (const slug of slugs) {
      const file = path.join(process.cwd(), "content", "best", `${slug}.json`)
      const page = JSON.parse(fs.readFileSync(file, "utf8")) as {
        description: string
        pricingSummary: string
        picks: Array<{ priceRange?: string; bestFor?: string }>
      }

      expect(page.description).toMatch(/not independently verified/i)
      expect(page.pricingSummary).toMatch(/not independently verified/i)
      expect(page.picks.length).toBeGreaterThan(0)
      for (const pick of page.picks) {
        expect(pick.priceRange).toMatch(/not independently verified/i)
        expect(pick.bestFor).not.toMatch(/is perfect for|is ideal for/i)
      }
    }
  })
})
