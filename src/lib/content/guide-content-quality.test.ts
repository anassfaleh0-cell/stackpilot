import { describe, expect, it } from "vitest"
import { getGuide } from "@/lib/content/registry"

describe("guide content quality", () => {
  it("replaces short template boilerplate with practical category-specific guidance", () => {
    const guide = getGuide("ai-implementation-guide")
    expect(guide).not.toBeNull()
    const text = (guide?.sections ?? []).map((section) => section.body).join(" ")

    expect(text).toContain("model quality on representative tasks")
    expect(text).toContain("held-out sample")
    expect(text).not.toContain("take stock of your team size, budget, existing tool stack")
    expect(guide?.description).not.toMatch(/how to evaluate the right/i)
    expect(guide?.readingTime).toBeGreaterThanOrEqual(4)
  })

  it("uses marketing measurement checks for attribution guidance", () => {
    const guide = getGuide("marketing-attribution-guide")
    expect(guide).not.toBeNull()
    const text = (guide?.sections ?? []).map((section) => section.body).join(" ")

    expect(text).toContain("consent-aware tracking")
    expect(text).toContain("double-counted conversions")
    expect(text).toContain("pilot")
  })
})
