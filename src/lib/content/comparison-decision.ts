export interface ComparisonDecisionInput {
  winner?: string | null
  winnerVerified?: boolean
  tool1: string
  tool1Slug: string
  tool1Category?: string | null
  tool2: string
  tool2Slug: string
  tool2Category?: string | null
}

export interface ComparisonDecision {
  categoriesDiffer: boolean
  winnerLabel: string | null
  hasComparableWinner: boolean
}

/**
 * Treat a dataset winner as comparable only when both linked reviews identify
 * the same primary category and the winner maps to one of the compared tools.
 */
export function getComparisonDecision(input: ComparisonDecisionInput): ComparisonDecision {
  const categoriesDiffer = Boolean(
    input.tool1Category &&
    input.tool2Category &&
    input.tool1Category !== input.tool2Category
  )
  const winner = input.winnerVerified === true ? input.winner?.trim().toLowerCase() : null
  const tool1IsWinner = Boolean(winner && [input.tool1Slug, input.tool1].some((value) => value.toLowerCase() === winner))
  const tool2IsWinner = Boolean(winner && [input.tool2Slug, input.tool2].some((value) => value.toLowerCase() === winner))
  const winnerLabel = tool1IsWinner ? input.tool1 : tool2IsWinner ? input.tool2 : null

  return {
    categoriesDiffer,
    winnerLabel,
    hasComparableWinner: Boolean(winnerLabel && !categoriesDiffer),
  }
}

/** Hide raw feature values unless the comparison has auditable feature-level sources. */
export function getComparisonFeatureDisplayValue(value: boolean | string, featuresVerified?: boolean): boolean | string {
  if (featuresVerified !== true) return "Not verified"
  return typeof value === "string" && !value.trim() ? "Not recorded" : value
}
