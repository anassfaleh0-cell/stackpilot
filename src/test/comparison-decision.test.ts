import { describe, expect, it } from "vitest"
import { getComparisonDecision } from "@/lib/content/comparison-decision"

describe("comparison winner and verdict integrity", () => {
  const base = {
    tool1: "Linear",
    tool1Slug: "linear",
    tool1Category: "Project Management",
    tool2: "Jira",
    tool2Slug: "jira",
    tool2Category: "Project Management",
  }

  it("does not treat a verdict phrase as a product winner", () => {
    const result = getComparisonDecision({ ...base, winner: "Depends on team workflow" })
    expect(result.hasComparableWinner).toBe(false)
    expect(result.winnerLabel).toBeNull()
    expect(result.provisionalWinnerLabel).toBeNull()
  })

  it("keeps a product pick provisional until the record is verified", () => {
    const result = getComparisonDecision({ ...base, winner: "Linear", winnerVerified: false })
    expect(result.hasComparableWinner).toBe(false)
    expect(result.winnerLabel).toBeNull()
    expect(result.provisionalWinnerLabel).toBe("Linear")
  })

  it("only returns a verified winner when it matches one of the compared tools", () => {
    const result = getComparisonDecision({ ...base, winner: "jira", winnerVerified: true })
    expect(result.hasComparableWinner).toBe(true)
    expect(result.winnerLabel).toBe("Jira")
    expect(result.provisionalWinnerLabel).toBeNull()
  })

  it("does not present cross-category products as a direct head-to-head winner", () => {
    const result = getComparisonDecision({
      ...base,
      tool2Category: "Developer Tools",
      winner: "Linear",
      winnerVerified: true,
    })
    expect(result.categoriesDiffer).toBe(true)
    expect(result.hasComparableWinner).toBe(false)
    expect(result.winnerLabel).toBe("Linear")
  })
})
