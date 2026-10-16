import { describe, expect, it } from "vitest"
import { getComparisonDecision, getComparisonDisplayCopy, getComparisonFeatureDisplayValue } from "./comparison-decision"

describe("getComparisonDecision", () => {
  it("maps a slug winner to the human-readable product name", () => {
    expect(getComparisonDecision({
      winner: "1password",
      winnerVerified: true,
      tool1: "1Password",
      tool1Slug: "1password",
      tool1Category: "Security & Compliance",
      tool2: "Appwrite",
      tool2Slug: "appwrite",
      tool2Category: "Security & Compliance",
    })).toEqual({
      categoriesDiffer: false,
      winnerLabel: "1Password",
      hasComparableWinner: true,
    })
  })

  it("does not declare a winner across different primary categories", () => {
    expect(getComparisonDecision({
      winner: "1password",
      winnerVerified: true,
      tool1: "1Password",
      tool1Slug: "1password",
      tool1Category: "Security & Compliance",
      tool2: "Appwrite",
      tool2Slug: "appwrite",
      tool2Category: "Developer Tools",
    })).toEqual({
      categoriesDiffer: true,
      winnerLabel: "1Password",
      hasComparableWinner: false,
    })
  })

  it("does not publish a stored winner without explicit provenance", () => {
    expect(getComparisonDecision({
      winner: "alpha",
      tool1: "Alpha",
      tool1Slug: "alpha",
      tool1Category: "Project Management",
      tool2: "Beta",
      tool2Slug: "beta",
      tool2Category: "Project Management",
    })).toEqual({
      categoriesDiffer: false,
      winnerLabel: null,
      hasComparableWinner: false,
    })
  })

  it("does not accept a winner that does not match either compared product", () => {
    expect(getComparisonDecision({
      winner: "unknown-product",
      tool1: "Alpha",
      tool1Slug: "alpha",
      tool1Category: "Project Management",
      tool2: "Beta",
      tool2Slug: "beta",
      tool2Category: "Project Management",
    })).toEqual({
      categoriesDiffer: false,
      winnerLabel: null,
      hasComparableWinner: false,
    })
  })
})


describe("getComparisonFeatureDisplayValue", () => {
  it("does not present unsupported booleans or plan labels as verified facts", () => {
    expect(getComparisonFeatureDisplayValue(true, false)).toBe("Not verified")
    expect(getComparisonFeatureDisplayValue(false, undefined)).toBe("Not verified")
    expect(getComparisonFeatureDisplayValue("Freemium", false)).toBe("Not verified")
  })

  it("shows values only when feature-level verification is explicitly true", () => {
    expect(getComparisonFeatureDisplayValue(true, true)).toBe(true)
    expect(getComparisonFeatureDisplayValue(false, true)).toBe(false)
    expect(getComparisonFeatureDisplayValue("Freemium", true)).toBe("Freemium")
  })
})


describe("getComparisonDisplayCopy", () => {
  it("replaces unsupported winner, rating, and price claims in cross-category copy", () => {
    const copy = getComparisonDisplayCopy({
      tool1: "Canva",
      tool2: "Framer",
      tool1Category: "Design & Creative",
      tool2Category: "Web Design",
      winnerVerified: false,
      description: "Canva is our overall pick — Canva 4.6/5, Framer 4.3/5; Canva from $12.99/mo.",
      verdict: "We name Canva as the overall winner. Canva achieves a 4.6/5 rating.",
    })

    expect(copy.description).toContain("different primary categories")
    expect(copy.verdict).toContain("different primary categories")
    expect(copy.description).not.toContain("overall pick")
    expect(copy.description).not.toContain("4.6/5")
    expect(copy.description).not.toContain("$12.99")
    expect(copy.verdict).not.toContain("overall winner")
    expect(copy.verdict).not.toContain("4.6/5")
  })

  it("preserves neutral copy for same-category comparisons when no unsupported claims exist", () => {
    const copy = getComparisonDisplayCopy({
      tool1: "Linear",
      tool2: "Jira",
      tool1Category: "Project Management",
      tool2Category: "Project Management",
      winnerVerified: false,
      description: "Compare workflow flexibility, integrations, and migration effort.",
      verdict: "Test representative workflows and confirm permissions before switching.",
    })

    expect(copy.description).toBe("Compare workflow flexibility, integrations, and migration effort.")
    expect(copy.verdict).toBe("Test representative workflows and confirm permissions before switching.")
  })
})
