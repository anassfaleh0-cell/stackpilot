import type { FAQItem } from "@/types/content"

const BROKEN_CONTENT_PATTERNS = [
  /\bcombines\s*\.\s*$/i,
  /\bintermittent connect\.?\s*$/i,
  /\bdependency mapp\.?\s*$/i,
  /\bfeature superiority rather than absolute feature superiority\b/i,
  /\bwith minimal training overhead\.?\s*$/i,
]

const GENERIC_ANSWER_PATTERNS = [
  /^the best choice depends on your team'?s specific workflow requirements and existing technology stack\.?$/i,
  /^understanding these constraints before purchasing helps set realistic expectations\.?$/i,
  /^these features make .+ suitable for teams of most sizes\.?$/i,
  /^teams should assess their needs against free tier limitations before upgrading\.?$/i,
  /^the platform provides documentation, onboarding resources, and setup tutorials to facilitate the process\.?$/i,
]

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

function isLowValueAnswer(answer: string): boolean {
  const trimmed = answer.trim()
  if (trimmed.length < 60) return true
  if (BROKEN_CONTENT_PATTERNS.some((pattern) => pattern.test(trimmed))) return true
  if (GENERIC_ANSWER_PATTERNS.some((pattern) => pattern.test(trimmed))) return true
  if (/\b(?:combines|connect|mapp|functionality)\s*\.\s*$/i.test(trimmed)) return true
  return false
}

/**
 * Keep only distinct, complete FAQ entries suitable for the review page and its
 * FAQ structured data. This is a conservative display filter, not a substitute
 * for editorial fact-checking or vendor-source verification.
 */
export function getVisibleReviewFaqs(faqs: FAQItem[], limit = 8): FAQItem[] {
  if (!Array.isArray(faqs) || !Number.isInteger(limit) || limit < 1) return []

  const questions = new Set<string>()
  const answers = new Set<string>()
  const visible: FAQItem[] = []

  for (const faq of faqs) {
    if (!faq || typeof faq.question !== "string" || typeof faq.answer !== "string") continue
    const question = faq.question.trim()
    const answer = faq.answer.replace(/\s+/g, " ").trim()
    const questionKey = normalize(question)
    const answerKey = normalize(answer)

    if (!questionKey || !answerKey || question.length < 8 || isLowValueAnswer(answer)) continue
    if (questions.has(questionKey) || answers.has(answerKey)) continue

    questions.add(questionKey)
    answers.add(answerKey)
    visible.push({ question, answer })
    if (visible.length >= limit) break
  }

  return visible
}
