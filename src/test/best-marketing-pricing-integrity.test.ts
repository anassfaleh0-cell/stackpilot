import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const contentPath = path.join(process.cwd(), "content", "best", "best-marketing-software.json")

describe("marketing software shortlist pricing integrity", () => {
  it("does not publish malformed price ranges or imply unverified pricing is confirmed", () => {
    const page = JSON.parse(fs.readFileSync(contentPath, "utf8")) as {
      description: string
      pricingSummary: string
      picks: Array<{ priceRange?: string }>
    }

    expect(page.description).not.toMatch(/\$\s*\d[^\n]*[“”]/)
    expect(page.pricingSummary).toMatch(/does not independently verify current prices/i)
    for (const pick of page.picks) {
      expect(pick.priceRange ?? "").not.toMatch(/[“”]/)
    }
  })
})
