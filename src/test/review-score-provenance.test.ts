import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

const REVIEW_PAGE = path.join(process.cwd(), "src", "app", "reviews", "[slug]", "page.tsx")
const HOME_PAGE = path.join(process.cwd(), "src", "app", "page.tsx")
const GUIDES_PAGE = path.join(process.cwd(), "src", "app", "guides", "page.tsx")
const REVIEWS_INDEX = path.join(process.cwd(), "src", "app", "reviews", "page.tsx")
const METHODOLOGY_PAGE = path.join(process.cwd(), "src", "app", "methodology", "page.tsx")

describe("review score provenance", () => {
  it("labels PilotStack scores as editorial assessments instead of third-party review aggregates", () => {
    const source = fs.readFileSync(REVIEW_PAGE, "utf8")

    expect(source).toContain("(PilotStack editorial score)")
    expect(source).toContain("this is PilotStack's assessment, not a third-party review aggregate")
    expect(source).not.toContain("across ${tool.reviewCount.toLocaleString()} recorded reviews")
    expect(source).not.toContain("({tool.reviewCount.toLocaleString()} reviews)")
    expect(source).not.toContain("const isBestValue = tool.pricing")
    expect(source).not.toContain("<Badge variant=\"warning\">Best Value</Badge>")
  })
  it("keeps commercial and expertise claims consistent with published disclosures", () => {
    const home = fs.readFileSync(HOME_PAGE, "utf8")
    const guides = fs.readFileSync(GUIDES_PAGE, "utf8")
    const reviewsIndex = fs.readFileSync(REVIEWS_INDEX, "utf8")
    const methodology = fs.readFileSync(METHODOLOGY_PAGE, "utf8")

    expect(home).toContain("Commercial relationships are disclosed")
    expect(home).not.toContain("No paid placements. No vendor influence.")
    expect(home).not.toContain("Independent & Unbiased")
    expect(home).not.toContain("Expert advice, straight to your inbox")
    expect(guides).not.toContain("Expert guides")
    expect(guides).not.toContain('name="Expert Guides"')
    expect(reviewsIndex).not.toContain("unbiased reviews of the best software tools")
    expect(methodology).not.toContain("no paid placements")
    expect(methodology).not.toContain("no vendor can pay for placement")
  })

})
