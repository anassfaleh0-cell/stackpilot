import { describe, expect, it } from "vitest"
import React from "react"
import fs from "node:fs"
import path from "node:path"
import { renderToStaticMarkup } from "react-dom/server"
import { ReviewCardGrid } from "@/components/entity/review-card-grid"

const baseItem = {
  slug: "linear",
  name: "Linear",
  category: "Project Management",
  rating: 4.8,
  tagline: "Issue tracking and planning for software teams.",
}

describe("ReviewCardGrid editorial scores", () => {
  it("shows a stored score with a provisional label while evidence is pending", () => {
    const html = renderToStaticMarkup(React.createElement(ReviewCardGrid, { items: [baseItem] }))

    expect(html).toContain("4.8/5")
    expect(html).toContain("Provisional")
    expect(html).toContain("provisional; evidence pending")
  })

  it("shows verified editorial scores without the provisional label", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReviewCardGrid, { items: [{ ...baseItem, ratingVerified: true }] }),
    )

    expect(html).toContain("4.8/5")
    expect(html).toContain("Verified PilotStack editorial score")
    expect(html).not.toContain("Provisional")
  })

  it("does not display missing or out-of-range scores", () => {
    const html = renderToStaticMarkup(
      React.createElement(ReviewCardGrid, {
        items: [{ ...baseItem, rating: 6 }],
      }),
    )

    expect(html).not.toContain("6/5")
    expect(html).not.toContain("Provisional")
  })

  it("passes valid stored scores and verification state from review records to cards", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src", "app", "reviews", "page.tsx"), "utf8")

    expect(source).toContain("rating: typeof t.rating === \"number\"")
    expect(source).toContain("ratingVerified: t.ratingVerified === true")
    expect(source).toContain("provisional values are not third-party ratings")
  })
})
