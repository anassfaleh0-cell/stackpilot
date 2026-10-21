import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

const read = (relativePath: string) => fs.readFileSync(path.join(process.cwd(), relativePath), "utf8")

describe("review navigation and social metadata integrity", () => {
  it("uses the same filtered section list for rendered sections and the table of contents", () => {
    const page = read("src/app/reviews/[slug]/page.tsx")
    expect(page).toContain("{visibleContent.map((section, i) => (")
    expect(page).toContain("{visibleContent.length > 0 && (")
    expect(page).not.toContain("{tool.content.map((section, i) => (")
    expect(page).not.toContain("{tool.content.length > 0 && (")
  })

  it("uses the shared author registry rather than importing an App Router page module", () => {
    const page = read("src/app/reviews/[slug]/page.tsx")
    expect(page).toContain('import { isPublicAuthor } from "@/lib/authors"')
    expect(page).not.toContain('from "@/app/authors/[slug]/page"')
  })

  it("does not present unverified third-party review counts in social images", () => {
    const image = read("src/app/reviews/[slug]/opengraph-image.tsx")
    expect(image).not.toContain("tool.reviewCount")
    expect(image).toContain("tool.ratingVerified === true")
    expect(image).toContain("PilotStack editorial score · Internal assessment, not a third-party rating")
    expect(image).toContain("Rating not independently verified")
  })
})
