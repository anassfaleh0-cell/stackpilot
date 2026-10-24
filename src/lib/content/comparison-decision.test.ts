import { describe, expect, it } from "vitest"
import { getComparisonDecision, getComparisonDisplayCopy, getComparisonFeatureDisplayValue } from "./comparison-decision"

describe("getComparisonDecision", () => {
  it("preserves historical rating and review-count values while labeling their provenance", () => {
    expect(getComparisonFeatureDisplayValue("4.6/5", false, true, "Recorded rating")).toContain("4.6/5")
    expect(getComparisonFeatureDisplayValue("125 reviews", false, true, "Review count")).toContain("125 reviews")
    expect(getComparisonFeatureDisplayValue("4.6/5", false, true, "Recorded rating")).toContain("not independently verified")
    expect(getComparisonFeatureDisplayValue("4.6/5", true, true, "Recorded rating")).toBe("4.6/5")
  })

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
      provisionalWinnerLabel: null,
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
      provisionalWinnerLabel: null,
      hasComparableWinner: false,
    })
  })

  it("labels a stored winner provisional when explicit provenance is absent", () => {
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
      provisionalWinnerLabel: "Alpha",
      hasComparableWinner: false,
    })
  })

  it("keeps a stored same-category winner visible as provisional when provenance is pending", () => {
    expect(getComparisonDecision({
      winner: "alpha",
      winnerVerified: false,
      tool1: "Alpha",
      tool1Slug: "alpha",
      tool1Category: "Project Management",
      tool2: "Beta",
      tool2Slug: "beta",
      tool2Category: "Project Management",
    })).toEqual({
      categoriesDiffer: false,
      winnerLabel: null,
      provisionalWinnerLabel: "Alpha",
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
      provisionalWinnerLabel: null,
      hasComparableWinner: false,
    })
  })
})


describe("getComparisonFeatureDisplayValue", () => {
  it("renders null and empty imported values as missing evidence, never the literal null", () => {
    expect(getComparisonFeatureDisplayValue(null)).toBe("Not confirmed — verify with the vendor")
    expect(getComparisonFeatureDisplayValue(undefined)).toBe("Not confirmed — verify with the vendor")
    expect(getComparisonFeatureDisplayValue("null")).toBe("Not confirmed — verify with the vendor")
    expect(getComparisonFeatureDisplayValue("undefined")).toBe("Not confirmed — verify with the vendor")
    expect(getComparisonFeatureDisplayValue("")).toBe("Not confirmed — verify with the vendor")
  })

  it("does not present unsupported booleans or plan labels as verified facts", () => {
    expect(getComparisonFeatureDisplayValue(true, false)).toContain("Yes")
    expect(getComparisonFeatureDisplayValue(false, undefined)).toContain("No")
    expect(getComparisonFeatureDisplayValue("Freemium", false)).toContain("Freemium")
  })

  it("shows values only when feature-level verification is explicitly true", () => {
    expect(getComparisonFeatureDisplayValue(true, true)).toBe(true)
    expect(getComparisonFeatureDisplayValue(false, true)).toBe(false)
    expect(getComparisonFeatureDisplayValue("Freemium", true)).toBe("Freemium")
  })

  it("shows editorial role labels for decision guides without treating booleans as verified", () => {
    expect(getComparisonFeatureDisplayValue("AI-assisted drafting", false, true)).toBe("AI-assisted drafting")
    expect(getComparisonFeatureDisplayValue("AI-assisted drafting", false, true)).not.toContain("not independently verified")
    expect(getComparisonFeatureDisplayValue("   ", false, true)).toBe("Not confirmed — verify with the vendor")
    expect(getComparisonFeatureDisplayValue(true, false, true)).toContain("Yes")
    expect(getComparisonFeatureDisplayValue(true, false, true)).toContain("not independently verified")
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

  it("preserves authored role-based copy for a decision guide across different categories", () => {
    const copy = getComparisonDisplayCopy({
      tool1: "ChatGPT",
      tool2: "Appwrite",
      tool1Category: "AI & Machine Learning",
      tool2Category: "Developer Tools",
      winnerVerified: false,
      decisionGuide: true,
      description: "ChatGPT focuses on conversational AI assistance; Appwrite focuses on backend services.",
      verdict: "Choose based on the workflow you need; there is no universal winner.",
    })

    expect(copy.description).toContain("ChatGPT focuses on conversational AI assistance")
    expect(copy.verdict).toContain("there is no universal winner")
  })

  it("still replaces unsupported metrics in a decision guide", () => {
    const copy = getComparisonDisplayCopy({
      tool1: "Alpha",
      tool2: "Beta",
      tool1Category: "Category A",
      tool2Category: "Category B",
      winnerVerified: false,
      decisionGuide: true,
      description: "Alpha scores 4.8/5 and costs $20.",
      verdict: "Alpha is the overall winner.",
    })
    expect(copy.description).not.toContain("4.8/5")
    expect(copy.verdict).not.toContain("overall winner")
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
