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
  categoriesComparable: boolean
  winnerLabel: string | null
  provisionalWinnerLabel: string | null
  hasComparableWinner: boolean
}

/**
 * Treat a dataset winner as comparable only when both linked reviews identify
 * the same primary category and the winner maps to one of the compared tools.
 */
export function getComparisonDecision(input: ComparisonDecisionInput): ComparisonDecision {
  const tool1Category = input.tool1Category?.trim()
  const tool2Category = input.tool2Category?.trim()
  const categoriesDiffer = Boolean(tool1Category && tool2Category && tool1Category !== tool2Category)
  // Missing category data is not evidence that the products are comparable.
  const categoriesComparable = Boolean(tool1Category && tool2Category && tool1Category === tool2Category)
  const storedWinner = input.winner?.trim().toLowerCase() || null
  const tool1IsWinner = Boolean(storedWinner && [input.tool1Slug, input.tool1].some((value) => value.toLowerCase() === storedWinner))
  const tool2IsWinner = Boolean(storedWinner && [input.tool2Slug, input.tool2].some((value) => value.toLowerCase() === storedWinner))
  const storedWinnerLabel = tool1IsWinner ? input.tool1 : tool2IsWinner ? input.tool2 : null
  const winnerLabel = input.winnerVerified === true ? storedWinnerLabel : null
  // Keep an existing dataset pick visible as provisional guidance when it maps to
  // one of the compared products, but never upgrade it to a verified winner.
  const provisionalWinnerLabel = input.winnerVerified !== true && categoriesComparable ? storedWinnerLabel : null

  return {
    categoriesDiffer,
    categoriesComparable,
    winnerLabel,
    provisionalWinnerLabel,
    hasComparableWinner: Boolean(winnerLabel && categoriesComparable),
  }
}

const HAS_PROVENANCE_NOTE = /\b(?:recorded;\s*not independently verified|not independently verified|verification pending|source verification is pending|underlying values are not independently verified)\b/i

/** Preserve stored comparison values while identifying data that has not been independently verified. */
export function getComparisonFeatureDisplayValue(value: boolean | string | null | undefined, featuresVerified?: boolean, decisionGuide = false, featureName = ""): boolean | string {
  // Nulls in imported comparison records mean that no reliable value was supplied.
  // Never stringify them as the literal word "null" or imply the missing value is verified.
  if (value == null || (typeof value === "string" && (!value.trim() || /^(?:null|undefined|n\/a|not recorded)$/i.test(value.trim())))) {
    return "Not confirmed — verify with the vendor"
  }
  // Do not stack a second generic disclaimer onto a source value that already has
  // a clear provenance note. This used to produce duplicate phrases in table cells.
  const alreadyDisclosed = typeof value === "string" && HAS_PROVENANCE_NOTE.test(value)
  // Decision-guide text is usually authored evaluation guidance, not a factual product claim.
  // Keep instructions readable, but retain provenance labels on explicit rating/count/pricing rows.
  if (decisionGuide && typeof value === "string") {
    const isRecordedMetric = /\b(?:rating|review count|pricing information|price range)\b/i.test(featureName)
    return featuresVerified === true || !isRecordedMetric || alreadyDisclosed ? value : `${value} (recorded; not independently verified)`
  }
  if (featuresVerified === true || alreadyDisclosed) return value
  const label = typeof value === "boolean" ? (value ? "Yes" : "No") : value
  return `${label} (recorded; not independently verified)`
}


export interface ComparisonDisplayCopyInput {
  tool1: string
  tool2: string
  tool1Category?: string | null
  tool2Category?: string | null
  winnerVerified?: boolean
  decisionGuide?: boolean
  description: string
  verdict: string
}

export interface ComparisonDisplayCopy {
  description: string
  verdict: string
}

const UNSUPPORTED_SCORE_OR_PRICE = /\b\d(?:\.\d)?\s*\/\s*5\b|[$€£]\s?\d|\b(?:pricing starts|starts at|starting at|from free)\b/i
const UNSUPPORTED_WINNER_CLAIM = /\b(?:our overall pick|overall pick|overall winner|our recommendation|recommended for most|higher user rating|wins overall)\b/i

/**
 * Prevent unsupported comparison scores, prices, and winner claims from appearing
 * in page copy, metadata, or structured data. Cross-category pairs use role-based
 * copy instead of presenting products as direct substitutes.
 */
export function getComparisonDisplayCopy(input: ComparisonDisplayCopyInput): ComparisonDisplayCopy {
  const category1 = input.tool1Category?.trim()
  const category2 = input.tool2Category?.trim()
  const categoriesDiffer = Boolean(category1 && category2 && category1 !== category2)
  const categoriesComparable = Boolean(category1 && category2 && category1 === category2)
  const winnerVerifiedForComparison = input.winnerVerified === true && categoriesComparable
  // A phrase denying an overall winner must not be mistaken for a positive
  // unsupported endorsement. Compare each field independently: an unsupported
  // verdict must never erase a valid, product-specific meta description.
  const negatedWinner = /\b(?:does not (?:name|identify|establish|claim|verify)|did not (?:name|identify|establish)|no|not an?|without naming an?)\s+(?:(?:an?|the|independently|auditable|verified|universal)\s+)*overall winner\b/gi
  const hasUnsupportedWinner = (value: string) =>
    !winnerVerifiedForComparison && UNSUPPORTED_WINNER_CLAIM.test(value.replace(negatedWinner, ""))

  const unsafeDescription = UNSUPPORTED_SCORE_OR_PRICE.test(input.description) || hasUnsupportedWinner(input.description)
  const unsafeVerdict = UNSUPPORTED_SCORE_OR_PRICE.test(input.verdict) || hasUnsupportedWinner(input.verdict)
  if (input.decisionGuide === true && !unsafeDescription && !unsafeVerdict) {
    return { description: input.description, verdict: input.verdict }
  }
  if (!categoriesDiffer && !unsafeDescription && !unsafeVerdict) {
    return { description: input.description, verdict: input.verdict }
  }

  const fallbackDescription = categoriesDiffer
    ? `${input.tool1} (${category1}) and ${input.tool2} (${category2}) serve different primary categories. Compare their roles, overlapping workflows, integrations, plan limits, and total cost to decide whether one tool meets your needs or whether they complement each other.`
    : `Compare ${input.tool1} and ${input.tool2} against your workflow, integration requirements, plan limits, and total cost. Confirm current capabilities and pricing directly with each vendor before choosing.`

  const fallbackVerdict = categoriesDiffer
    ? `These products serve different primary categories: ${input.tool1} focuses on ${category1}, while ${input.tool2} focuses on ${category2}. Treat them as alternatives only if your workflow overlaps. Confirm current capabilities, integrations, security requirements, plan limits, and total cost directly with each vendor before deciding.`
    : `The available record does not establish an auditable overall winner or independently verified scores and pricing. Compare both tools against your must-have workflows, integrations, permissions, data migration needs, support expectations, and total cost. Test representative tasks before committing.`

  if (categoriesDiffer) {
    // Do not publish a dubious direct head-to-head answer for unrelated tools.
    return { description: fallbackDescription, verdict: fallbackVerdict }
  }
  return {
    description: unsafeDescription ? fallbackDescription : input.description,
    verdict: unsafeVerdict ? fallbackVerdict : input.verdict,
  }
}
