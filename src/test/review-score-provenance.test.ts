import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

const REVIEW_PAGE = path.join(process.cwd(), "src", "app", "reviews", "[slug]", "page.tsx")

describe("review score provenance", () => {
  it("labels PilotStack scores as editorial assessments instead of third-party review aggregates", () => {
    const source = fs.readFileSync(REVIEW_PAGE, "utf8")

    expect(source).toContain("(PilotStack editorial score)")
    expect(source).toContain("this is PilotStack's assessment, not a third-party review aggregate")
    expect(source).not.toContain("across ${tool.reviewCount.toLocaleString()} recorded reviews")
    expect(source).not.toContain("({tool.reviewCount.toLocaleString()} reviews)")
  })
})
