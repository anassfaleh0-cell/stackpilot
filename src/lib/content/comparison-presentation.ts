import type { FAQItem } from "@/types/content"

const TEMPLATE_VERDICT_PATTERNS = [
  /after thorough evaluation/i,
  /emerges as our recommendation/i,
  /based on the recorded comparison criteria/i,
  /we recommend evaluating both tools against your requirements/i,
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
]

export function getComparisonVerdictForDisplay(verdict: string, categoriesDiffer: boolean): string {
  if (!TEMPLATE_VERDICT_PATTERNS.some((pattern) => pattern.test(verdict))) return verdict
  if (categoriesDiffer) {
    return "These products are listed under different categories in the linked review data. The stored verdict does not provide enough product-specific evidence to name a winner. Compare their separate use cases and verify capabilities, integrations, and current pricing with each vendor."
  }
  return "The stored verdict uses generic wording and does not provide enough product-specific evidence to justify an overall winner. Treat the feature rows as starting points, and verify capabilities, plan limits, integrations, and current pricing with each vendor."
}

export function getSpecificComparisonFaqs(faqs: FAQItem[]): FAQItem[] {
  return faqs.filter((faq) => !TEMPLATE_FAQ_PATTERNS.some((pattern) => pattern.test(faq.answer)))
}
