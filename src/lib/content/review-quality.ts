import type { ContentSection, FAQItem } from "@/types/content"

export function stripUnverifiedPriceClaims(value: string): string {
  const raw = String(value ?? "").trim()
  if (!raw) return ""
  const priceOrPlanClaim = /(?:starting at|starts at|from)?\s*[$€£]\s?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:user|seat|month|year|mo|yr))?|\b(?:USD|EUR|GBP)\s?\d[\d,]*(?:\.\d+)?(?:\s*\/\s*(?:user|seat|month|year|mo|yr))?|\b\d[\d,]*(?:\.\d+)?\s?(?:USD|EUR|GBP)\b(?:\s*\/\s*(?:user|seat|month|year|mo|yr))?|\b(?:free|freemium|paid|enterprise)\s+(?:plan|tier)\b|\bfree trial\b/i
  const sentences = raw.split(/(?<=[.!?])\s+|\n+/).map((sentence) => sentence.trim()).filter(Boolean)
  // Preserve recorded price and plan information for transparency, while making its status explicit.
  return sentences.map((sentence) => priceOrPlanClaim.test(sentence) && !/not independently verified|verification pending/i.test(sentence)
    ? sentence + " (recorded value; not independently verified—confirm current terms with the vendor)"
    : sentence).join(" ").replace(/\s{2,}/g, " ").trim()
}
export function getVisibleReviewContent(content: ContentSection[], showVerifiedPricing = false, showVerifiedRatings = false): ContentSection[] {
  // Keep recorded sections and scores visible. Provenance is handled by the page UI;
  // price claims are annotated rather than silently removed.
  void showVerifiedPricing
  void showVerifiedRatings
  return content
    .filter((section) => section.type !== "diagram" || ["implementation-flow", "pricing-ladder", "feature-radar"].includes(section.body))
    .map((section) => ({
      ...section,
      body: section.type === "diagram" ? section.body : stripUnverifiedPriceClaims(section.body),
      ...(Array.isArray(section.items) ? { items: section.items.map((item) => stripUnverifiedPriceClaims(item)).filter(Boolean) } : {}),
    }))
}


// Identify repeated FAQ templates that need an explicit source-status annotation.
const GENERATED_REVIEW_FAQ_PATTERNS = [
  /^.+ maintains SOC 2 Type II(?:, ISO 27001|, FedRAMP)? certifications?\./i,
  /^.+ is GDPR compliant with data processing agreements and data residency options\./i,
  /^.+ serves enterprise organizations with .+ certifications? and scalable infrastructure\./i,
  /^.+ offers .+ comprehensive .+ functionality, API access for custom integrations, and enterprise security with SOC 2 Type II\./i,
  /^.+ offers AI features like .+, comprehensive .+ functionality, API access for custom integrations, and enterprise security with SOC 2 Type II\./i,
  /^.+ is secure with SOC 2 Type II, ISO 27001, FedRAMP certifications\./i,
  /^Feature availability and limits can change by plan and over time\. Verify the current vendor documentation for your use case, then test the workflow in a trial or pilot before committing\.?$/i,
  /^.+ complies with GDPR, CCPA\./i,
  /^.+ has a low learning curve\. Most teams can complete initial setup and basic configuration within a few hours/i,
  /^.+ integrates with .+ and \d+\+ other platforms\..*Integration setup typically takes 15-30 minutes per connection\./i,
  /^.+ offers significant customization options\. Teams can configure settings, views, and notifications to suit their preferences\./i,
  /^Yes, .+ offers deep .+ integration that allows teams to link issues to branches, pull requests, and commits\./i,
  /^.+ is available on Cloud platforms\. Mobile apps are available for iOS and Android\./i,
]

export function getVisibleReviewFaqs(faqs: FAQItem[], showVerifiedPricing = false, showVerifiedFeatures = false): FAQItem[] {
  // Preserve useful Q&A rather than dropping whole answers. Unverified capability,
  // security, compliance, and pricing statements remain visible with clear provenance.
  return faqs
    .filter((faq) => typeof faq?.question === "string" && faq.question.trim() && typeof faq?.answer === "string" && faq.answer.trim())
    .map((faq) => {
      let question = faq.question.trim()
      let answer = faq.answer.trim()
      const hasFeatureOrTrustClaim = /\b(?:SOC 2|ISO 27001|FedRAMP|GDPR|CCPA|HIPAA|PCI DSS|SSO|data residency|API access|integrations?|mobile apps?|deployment options|security certifications?|compliance)\b/i.test(question + " " + answer)
        || GENERATED_REVIEW_FAQ_PATTERNS.some((pattern) => pattern.test(answer))
      if (!showVerifiedFeatures && hasFeatureOrTrustClaim && !/not independently verified|verification pending/i.test(answer)) {
        answer += " (stored profile claim; not independently verified—check the vendor's current documentation)"
      }
      if (!showVerifiedPricing) {
        question = stripUnverifiedPriceClaims(question)
        answer = stripUnverifiedPriceClaims(answer)
      }
      return { ...faq, question, answer }
    })
}
