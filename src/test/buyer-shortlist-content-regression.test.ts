import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const slugs = ["best-project-management-software", "best-password-managers", "best-accounting-software"]

describe("buyer shortlist content regression", () => {
  it("keeps pricing and ratings transparent and removes template-generated filler", () => {
    for (const slug of slugs) {
      const file = path.join(process.cwd(), "content", "best", `${slug}.json`)
      const page = JSON.parse(fs.readFileSync(file, "utf8")) as {
        description: string
        pricingSummary: string
        picks: Array<{ toolName: string; ratingVerified?: boolean; priceRange?: string; priceRangeVerified?: boolean; bestFor?: string; pros?: string[]; cons?: string[] }>
        comparisonTable?: { columns?: string[]; rows?: string[][] }
        faqs: Array<{ question: string; answer: string }>
        body: string
      }

      expect(page.description).toMatch(/not independently verified/i)
      expect(page.pricingSummary).toMatch(/not independently verified|not been verified/i)
      expect(page.picks.length).toBeGreaterThan(0)
      for (const pick of page.picks) {
        expect(pick.ratingVerified).toBe(false)
        expect(pick.priceRangeVerified).toBe(false)
        expect(pick.priceRange).toMatch(/not independently verified/i)
        expect(pick.bestFor).not.toMatch(/is perfect for|is ideal for|best for [a-z0-9-]+ is/i)
      }
      expect(page.comparisonTable?.rows?.length).toBe(page.picks.length)
      for (const row of page.comparisonTable?.rows ?? []) {
        expect(row.join(" ")).not.toMatch(/\$\d|\d\.\d\/5/)
        expect(row.join(" ")).toMatch(/not verified|not independently verified/i)
      }
      const visibleText = [page.description, page.pricingSummary, ...page.faqs.flatMap(faq => [faq.question, faq.answer]), page.body].join(" ")
      expect(visibleText).not.toMatch(/Founded 2020, HQ in\s*,\s*, serving\s*\./i)
      expect(visibleText).not.toMatch(/First-year ROI:\s*\d+[-–]\d+%/i)
      expect(visibleText).not.toMatch(/best-password-managers (?:compare|offers|handle|provide|scale)/i)
      expect(visibleText).not.toMatch(/\$\d+[“–-]\$?\d/)
      expect(page.body).toMatch(/Transparency note|Transparency note:/i)
      expect(page.faqs.length).toBeGreaterThanOrEqual(5)
    }
  })
})
