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
  /\b(?:is|was) the recorded (?:pick|winner)\b/i,
  /\b(?:recorded|source dataset) (?:pick|winner)\s*:/i,
  /\b(?:is|was) our (?:overall )?pick\b/i,
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
  /(?:square|xero|linear|clickup|asana|trello)\s+(?:starts at|is cheaper|scores higher|edges ahead|wins overall)/i,
  /\b(?:\d+(?:\.\d+)?\/5|\$\s?\d[\d,.]*|€\s?\d[\d,.]*)\b/i,
  /(?:pricing|price|cost).{0,100}(?:not independently verified|not verified).{0,100}(?:starts at|from free|\$|€)/i,
  /\bbased on (?:the )?recorded (?:comparison )?criteria.{0,100}\b(?:wins|winner|better|edges ahead)\b/i,
]
export function getComparisonVerdictForDisplay(verdict: string, categoriesDiffer: boolean): string {
  if (!TEMPLATE_VERDICT_PATTERNS.some((pattern) => pattern.test(verdict))) return verdict
  if (categoriesDiffer) {
    return "These products are listed under different categories in the linked review data. The stored verdict does not provide enough product-specific evidence to name a winner. Compare their separate use cases and verify capabilities, integrations, and current pricing with each vendor."
  }
  return "The stored verdict uses generic wording and does not provide enough product-specific evidence to justify an overall winner. Treat the feature rows as starting points, and verify capabilities, plan limits, integrations, and current pricing with each vendor."
}

export interface ComparisonFaqContext {
  tool1: string
  tool2: string
  tool1Category?: string | null
  tool2Category?: string | null
}

export function getSpecificComparisonFaqs(faqs: FAQItem[], context?: ComparisonFaqContext): FAQItem[] {
  const seenQuestions = new Set<string>()
  const useful: FAQItem[] = []

  for (const faq of faqs) {
    const question = typeof faq?.question === "string" ? faq.question.replace(/\s+/g, " ").trim() : ""
    const answer = typeof faq?.answer === "string" ? faq.answer.replace(/\s+/g, " ").trim() : ""
    const normalizedQuestion = question.toLowerCase()
    if (!question || !answer || !question.endsWith("?") || answer.length < 40 || answer.length > 700) continue
    if (seenQuestions.has(normalizedQuestion)) continue
    if (TEMPLATE_FAQ_PATTERNS.some((pattern) => pattern.test(question) || pattern.test(answer))) continue
    if (/\b(?:overall winner|scores higher|edges ahead|wins overall|is the better choice)\b/i.test(answer)) continue
    if (/\b\d+(?:\.\d+)?\s*\/\s*5\b|[$€£]\s?\d[\d,.]*/i.test(answer)) continue
    seenQuestions.add(normalizedQuestion)
    useful.push({ ...faq, question, answer })
    if (useful.length >= 8) break
  }

  // If imported FAQs are all boilerplate, provide a small, evidence-safe decision guide.
  if (context && useful.length < 3) {
    const tool1 = context.tool1.trim()
    const tool2 = context.tool2.trim()
    const category1 = context.tool1Category?.trim()
    const category2 = context.tool2Category?.trim()
    const categoriesDiffer = Boolean(category1 && category2 && category1.toLowerCase() !== category2.toLowerCase())
    const fallback: FAQItem[] = [
      { question: "What is the main difference between " + tool1 + " and " + tool2 + "?", answer: categoriesDiffer
        ? "The linked review data categorizes " + tool1 + " as " + category1 + " and " + tool2 + " as " + category2 + ". They may address different jobs, so compare overlapping requirements rather than treating them as direct substitutes."
        : "Compare " + tool1 + " and " + tool2 + " against the work you need to complete. Verify capabilities, integrations, permissions, and plan limits instead of assuming a generic feature table proves one product is better." },
      { question: "Can " + tool1 + " replace " + tool2 + "?", answer: "Only treat " + tool1 + " as a replacement if a controlled pilot shows it covers the tasks, data flows, integrations, permissions, and export needs you rely on in " + tool2 + ". Test a representative workflow in both products and record gaps before migrating." },
      { question: "How should I choose between " + tool1 + " and " + tool2 + "?", answer: "List mandatory requirements, then run the same representative tasks in both products. Compare accepted results, correction effort, accessibility, administration, migration, support, and total cost. Verify important capabilities with current vendor documentation." },
      { question: "Are pricing and feature limits for " + tool1 + " and " + tool2 + " current?", answer: "Do not treat this comparison as a live quote or proof of feature availability. Check official vendor pages and contract terms for current prices, plan limits, integrations, region, renewal, and cancellation before buying." },
    ]
    for (const faq of fallback) {
      if (useful.length >= 3) break
      if (seenQuestions.has(faq.question.toLowerCase())) continue
      seenQuestions.add(faq.question.toLowerCase())
      useful.push(faq)
    }
  }
  return useful
}
