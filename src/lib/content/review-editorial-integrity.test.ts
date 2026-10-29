import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"
import { getReview } from "./registry"

describe("review source preservation and anti-filler policy", () => {
  it.each(["linear", "stripe", "jotform", "ahrefs", "moz"])(
    "preserves the original %s record, numerical score, and editorial source links",
    (slug) => {
      const original = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content/reviews", slug + ".json"), "utf8"))
      const review = getReview(slug)
      expect(review).not.toBeNull()
      expect(review?.rating).toBe(original.rating)
      expect(review?.content.some((section) => /https?:\/\/|<a href=/.test(section.body))).toBe(true)
      expect(review?.content.length).toBeGreaterThan(0)
      expect(review?.content.some((section) => section.body.trim().length > 80)).toBe(true)
    },
  )

  it("never fabricates an 900-word review by appending a full set of generated chapters", () => {
    const slug = "sourceforge"
    const review = getReview(slug)
    const generated = new Set([
      "Fit and workflow checks", "Feature coverage to verify", "Integration and data movement",
      "Pricing and plan limits", "Implementation and adoption", "Security and data handling",
      "Recorded strengths and trade-offs", "Who should evaluate this tool", "A practical pilot checklist",
    ])
    const generatedCount = review?.content.filter((section) => generated.has(section.title)).length ?? 0
    expect(generatedCount).toBeLessThanOrEqual(3)
  })
})
