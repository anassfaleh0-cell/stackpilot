import type { FAQItem } from "@/types/content"

const TRUNCATED_DESCRIPTION_PATTERNS = [
  /,\s*[A-Z][\w.-]*\.\s*$/u,
  /(?:from\s+\$?[\d,.]+(?:–|-)\$?[\d,.]+\s*(?:\/mo)?\s*(?:\+ fees)?[,]?\s*[A-Z][\w.-]*\.)\s*$/iu,
  /(?:\.{3}|…|\b(?:and|or|with|for|from|including))\s*$/iu,
]

export function getComparisonDescriptionForDisplay(
  description: string,
  tool1: string,
  tool2: string,
): string {
  const normalized = description.replace(/\s+/g, " ").trim()
  const looksTruncated = TRUNCATED_DESCRIPTION_PATTERNS.some((pattern) => pattern.test(normalized))
  // Imported descriptions sometimes present a stored dataset label as an editorial
  // recommendation. Do not publish winner claims as metadata without validated evidence.
  const claimsWinner = /\b(?:our|the)\s+(?:overall\s+)?pick\b|\b(?:overall\s+)?winner\b|\bwe recommend\b|\b(?:is|as)\s+(?:our|the)\s+(?:top\s+)?choice\b/i.test(normalized)
  if (!normalized || looksTruncated || claimsWinner) {
    return tool1 + " vs " + tool2 + ": Compare their use cases, recorded features, and available plans. Confirm current pricing, plan limits, and integrations with each vendor before choosing."
  }
  return normalized
}

const TEMPLATE_VERDICT_PATTERNS = [
  /after thorough evaluation/i,
  /emerges as our recommendation/i,
  /based on the recorded comparison criteria/i,
  /we recommend evaluating both tools against your requirements/i,
  /\\b(?:is|was) the recorded (?:pick|winner)\\b/i,
  /\\b(?:recorded|source dataset) (?:pick|winner)\\s*:/i,
  /\\b(?:is|was) our (?:overall )?pick\\b/i,
]

const TEMPLATE_FAQ_PATTERNS = [
  /based on the recorded comparison criteria/i,
  /both platforms offer strong features/i,
  /the best choice depends on your team/i,
  /check our detailed review for support comparisons/i,
  /many organizations use both tools for complementary purposes/i,
  /both offer documentation and support tiers/i,
  /both platforms prioritize user experience/i,
  /our comparison table breaks down these differences/i,
  /excels at\s+[A-Z][\w.-]*\s+is a\b/i,
  /stronger for\s+[A-Z][\w.-]*\s+is a\b/i,
  /the best choice depends on your specific needs/i,
  /specific feature needs may favor one over the other/i,
]
export function getComparisonVerdictForDisplay(verdict: string, categoriesDiffer: boolean): string {
  if (!TEMPLATE_VERDICT_PATTERNS.some((pattern) => pattern.test(verdict))) return verdict
  if (categoriesDiffer) {
    return "These products are listed under different categories in the linked review data. The stored verdict does not provide enough product-specific evidence to name a winner. Compare their separate use cases and verify capabilities, integrations, and current pricing with each vendor."
  }
  return "The stored verdict uses generic wording and does not provide enough product-specific evidence to justify an overall winner. Treat the feature rows as starting points, and verify capabilities, plan limits, integrations, and current pricing with each vendor."
}

export function getSpecificComparisonFaqs(faqs: FAQItem[]): FAQItem[] {
  const seenQuestions = new Set<string>()
  const useful: FAQItem[] = []

  for (const faq of faqs) {
    const question = typeof faq?.question === "string" ? faq.question.replace(/\s+/g, " ").trim() : ""
    const answer = typeof faq?.answer === "string" ? faq.answer.replace(/\s+/g, " ").trim() : ""
    const normalizedQuestion = question.toLowerCase()

    // Do not expose empty, duplicate, malformed, or boilerplate Q&A in page text/schema.
    if (!question || !answer || !question.endsWith("?") || answer.length < 40 || answer.length > 700) continue
    if (seenQuestions.has(normalizedQuestion)) continue
    if (TEMPLATE_FAQ_PATTERNS.some((pattern) => pattern.test(question) || pattern.test(answer))) continue

    seenQuestions.add(normalizedQuestion)
    useful.push({ ...faq, question, answer })
    if (useful.length >= 8) break
  }

  return useful
}
