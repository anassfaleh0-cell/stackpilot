import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"
import { getAllComparisons, isContentAvailable } from "@/lib/content/registry"

const curated = [
  "1password-vs-bitwarden",
  "asana-vs-clickup",
  "figma-vs-sketch",
  "github-vs-sourceforge",
]

describe("homepage featured comparison relevance", () => {
  it("highlights available review profiles rather than the first catalog entries", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src", "app", "page.tsx"), "utf8")
    expect(source).toContain("featuredReviews.map")
    expect(source).not.toContain("reviews.slice(0, 6).map")
    for (const slug of ["linear", "figma", "notion", "github", "1password", "chatgpt"]) {
      expect(source).toContain(`"${slug}"`)
      expect(isContentAvailable("review", slug), slug).toBe(true)
    }
  })

  it("only links curated same-job comparisons backed by available records", () => {
    const all = getAllComparisons()
    for (const slug of curated) {
      expect(all.some((item) => item.slug === slug), slug).toBe(true)
      expect(isContentAvailable("comparison", slug), slug).toBe(true)
    }
  })

  it("does not select the first alphabetical comparison records", () => {
    const source = fs.readFileSync(path.join(process.cwd(), "src", "app", "page.tsx"), "utf8")
    for (const slug of curated) expect(source).toContain(`"${slug}"`)
    expect(source).toContain("featuredComparisons.map")
    expect(source).not.toContain("comparisons.slice(0, 4).map")
  })
})
