import { describe, expect, it } from "vitest"
import { getComparison } from "./registry"

describe("comparison verdict integrity", () => {
  it("retains a reviewed GitHub vs SourceForge decision rather than replacing it with generic filler", () => {
    const cmp = getComparison("github-vs-sourceforge")
    expect(cmp).not.toBeNull()
    expect(cmp?.verdict).toContain("release distribution")
    expect(cmp?.verdict).toContain("day-to-day development collaboration")
    expect(cmp?.verdict).not.toContain("The comparison table records the following details")
  })

  it("preserves the recorded Asana vs ClickUp editorial decision criteria", () => {
    const cmp = getComparison("asana-vs-clickup")
    expect(cmp?.verdict).toContain("Asana")
    expect(cmp?.verdict).toContain("ClickUp")
    expect(cmp?.verdict).toContain("structured project-management approach")
  })

  it("does not manufacture a verified winner for mismatched software categories", () => {
    const cmp = getComparison("1password-vs-appwrite")
    expect(cmp).not.toBeNull()
    expect(cmp?.winner).toBeNull()
    expect(cmp?.verdict).toContain("not direct substitutes")
  })
})
