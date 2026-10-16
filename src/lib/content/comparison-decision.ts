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


export interface ComparisonDisplayCopyInput {
  tool1: string
  tool2: string
  tool1Category?: string | null
  tool2Category?: string | null
  winnerVerified?: boolean
  description: string
  verdict: string
}

export interface ComparisonDisplayCopy {
  description: string
  verdict: string
}

const UNSUPPORTED_SCORE_OR_PRICE = /\\b\\d(?:\\.\\d)?\\s*\\/\\s*5\\b|[$€£]\\s?\\d|\\b(?:pricing starts|starts at|starting at|from free)\\b/i
const UNSUPPORTED_WINNER_CLAIM = /\\b(?:our overall pick|overall pick|overall winner|our recommendation|recommended for most|higher user rating|wins overall)\\b/i

/**
 * Prevent unsupported comparison scores, prices, and winner claims from appearing
 * in page copy, metadata, or structured data. Cross-category pairs use role-based
 * copy instead of presenting products as direct substitutes.
 */
export function getComparisonDisplayCopy(input: ComparisonDisplayCopyInput): ComparisonDisplayCopy {
  const category1 = input.tool1Category?.trim()
  const category2 = input.tool2Category?.trim()
  const categoriesDiffer = Boolean(category1 && category2 && category1 !== category2)
  const containsUnsupportedMetrics = UNSUPPORTED_SCORE_OR_PRICE.test(input.description) ||
    UNSUPPORTED_SCORE_OR_PRICE.test(input.verdict)
  const containsUnsupportedWinner = input.winnerVerified !== true && (
    UNSUPPORTED_WINNER_CLAIM.test(input.description) || UNSUPPORTED_WINNER_CLAIM.test(input.verdict)
  )

  if (!categoriesDiffer && !containsUnsupportedMetrics && !containsUnsupportedWinner) {
    return { description: input.description, verdict: input.verdict }
  }

  const description = categoriesDiffer
    ? `${input.tool1} (${category1}) and ${input.tool2} (${category2}) serve different primary categories. Compare their roles, overlapping workflows, integrations, plan limits, and total cost to decide whether one tool meets your needs or whether they complement each other.`
    : `Compare ${input.tool1} and ${input.tool2} against your workflow, integration requirements, plan limits, and total cost. Confirm current capabilities and pricing directly with each vendor before choosing.`

  const verdict = categoriesDiffer
    ? `These products serve different primary categories: ${input.tool1} focuses on ${category1}, while ${input.tool2} focuses on ${category2}. Treat them as alternatives only if your workflow overlaps. Confirm current capabilities, integrations, security requirements, plan limits, and total cost directly with each vendor before deciding.`
    : `The available record does not establish an auditable overall winner or independently verified scores and pricing. Compare both tools against your must-have workflows, integrations, permissions, data migration needs, support expectations, and total cost. Test representative tasks before committing.`

  return { description, verdict }
}
