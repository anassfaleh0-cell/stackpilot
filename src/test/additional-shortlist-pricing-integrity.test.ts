import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const slugs = [
  "best-ai-writing-tools",
  "best-ai-writing-tools-2026",
  "best-analytics-platforms-2026",
  "best-communication-tools",
  "best-crm-software",
  "best-ai-tools",
  "best-analytics-software",
  "best-api-management-tools",
  "best-collaboration-software",
  "best-accounting-software",
  "best-api-testing-tools",
  "best-authentication-platforms",
  "best-backend-platforms",
  "best-bi-tools",
  "best-crm-software-2026",
  "best-communication-tools-2026",
  "best-email-marketing-software",
  "best-ecommerce-platforms",
  "best-business-intelligence",
  "best-developer-tools",
  "best-free-accounting",
  "best-budgeting-tools",
  "best-cloud-erp",
  "best-cms-platforms",
  "best-customer-support-software",
  "best-data-visualization",
  "best-business-phone-systems",
  "best-endpoint-security",
  "best-erp-software",
  "best-expense-management-software",
]

describe("additional shortlist pricing integrity", () => {
  it("does not present unverified prices or ratings as confirmed", () => {
    for (const slug of slugs) {
      const file = path.join(process.cwd(), "content", "best", `${slug}.json`)
      const page = JSON.parse(fs.readFileSync(file, "utf8")) as {
        description: string
        pricingSummary: string
        picks: Array<{ priceRange?: string }>
      }

      expect(page.description, slug).toMatch(/not (?:been )?independently verified/i)
      expect(page.pricingSummary, slug).toMatch(/not (?:been )?independently verified/i)
      expect(page.picks.length, slug).toBeGreaterThan(0)
      for (const pick of page.picks) {
        expect(pick.priceRange, slug).toMatch(/not (?:been )?independently verified/i)
      }
    }
  })
})
