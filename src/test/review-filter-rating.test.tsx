import { describe, expect, it } from "vitest"
import React from "react"
import fs from "node:fs"
import path from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { ReviewFilter } from "@/components/entity/review-filter"

const baseReview = {
  slug: "linear",
  name: "Linear",
  tagline: "Issue tracking and planning for software teams.",
  category: "Project Management",
}

describe("ReviewFilter editorial scores", () => {
  it("shows stored provisional scores with an explicit label", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReviewFilter, {
        category: "Project Management",
        reviews: [{ ...baseReview, rating: 4.8, ratingVerified: false }],
      }),
    )

    expect(html).toContain("4.8/5")
    expect(html).toContain("Provisional")
    expect(html).toContain("provisional; evidence pending")
  })

  it("shows verified scores without a provisional label and states when no score exists", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReviewFilter, {
        category: "Project Management",
        reviews: [
          { ...baseReview, rating: 4.6, ratingVerified: true },
          { ...baseReview, slug: "example", name: "Example", rating: undefined },
        ],
      }),
    )

    expect(html).toContain("4.6/5")
    expect(html).toContain("verified")
    expect(html).toContain("Score not recorded")
  })

  it("passes stored scores and their verification state from category records", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src", "app", "category", "[slug]", "page.tsx"), "utf8")

    expect(source).toContain("rating: typeof r.rating === \"number\"")
    expect(source).toContain("ratingVerified: r.ratingVerified === true")
  })
})
