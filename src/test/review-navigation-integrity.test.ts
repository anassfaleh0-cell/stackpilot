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

  it("links the review CTA to the vendor URL rather than a fabricated Google search", () => {
    const page = read("src/app/reviews/[slug]/page.tsx")
    expect(page).toContain("href={tool.website || `/reviews/${tool.slug}`}")
    expect(page).not.toContain("tool.name + \" official website\"")
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
  it("excludes permanently redirected legacy slugs from listing and related cards", () => {
    const alternativesIndex = read("src/app/alternatives/page.tsx")
    const bestIndex = read("src/app/best/page.tsx")
    const alternativesDetail = read("src/app/alternatives/[slug]/page.tsx")
    const bestDetail = read("src/app/best/[slug]/page.tsx")

    expect(alternativesIndex).toContain("REDIRECTED_ALTERNATIVE_SLUGS.has(item.slug)")
    expect(bestIndex).toContain("REDIRECTED_BEST_SLUGS.has(item.slug)")
    expect(alternativesDetail).toContain("!REDIRECTED_ALTERNATIVE_SLUGS.has(item.slug)")
    expect(bestDetail).toContain("!REDIRECTED_BEST_SLUGS.has(item.slug)")
  })

  it("does not describe unverified aggregate scores as published calculations", () => {
    const editorialProcess = read("src/components/seo/editorial-process.tsx")
    expect(editorialProcess).toContain("An aggregate score is shown only when the underlying category ratings and calculation can be verified")
    expect(editorialProcess).toContain("consistency does not itself mean a rating or review count has been independently verified")
    expect(editorialProcess).not.toContain("The displayed overall score is calculated from the recorded category ratings")
  })

})
