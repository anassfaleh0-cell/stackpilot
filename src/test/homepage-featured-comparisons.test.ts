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
