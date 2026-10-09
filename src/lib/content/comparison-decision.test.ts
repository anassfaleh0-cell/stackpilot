import { describe, expect, it } from "vitest"
import { getComparisonDecision } from "./comparison-decision"

describe("getComparisonDecision", () => {
  it("maps a slug winner to the human-readable product name", () => {
    expect(getComparisonDecision({
      winner: "1password",
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
