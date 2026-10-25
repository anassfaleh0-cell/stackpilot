import { readFileSync } from "node:fs"
import { resolve } from "node:path"
import { describe, expect, it } from "vitest"

describe("category page taxonomy regression", () => {
  it("uses the shared alias matcher for reviews as well as supporting content", () => {
    const source = readFileSync(resolve(process.cwd(), "src/app/category/[slug]/page.tsx"), "utf8")
    expect(source).toContain('isContentAvailable("review", r.slug) && categoryMatches(r.category, category.name)')
    expect(source).not.toContain('isContentAvailable("review", r.slug) && r.category === category.name')
    expect(source).toContain('categoryMatches(g.category, category.name)')
    expect(source).toContain('categoryMatches(c.category, category.name)')
    expect(source).toContain('categoryMatches(p.category, category.name)')
    expect(source).toContain('categoryMatches(t.category, category.name)')
  })
})
