import type { ContentSection, FAQItem } from "@/types/content"

const HIDDEN_REVIEW_SECTION_TITLES = new Set([
  "Quick Answer",
  "TL;DR",
  "Rating Overview",
  "Key Features",
  "Hidden Costs",
  "Learning Curve",
  "Setup Time",
  "Migration Difficulty",
  "Industry Fit",
  "Common Mistakes",
  "Tips from experienced users",
  "Buying Advice",
])

// These patterns identify stock copy that asserts tests, ratings, customer counts,
// security status, performance guarantees, or deployment timings without page-specific evidence.
// Only sections beginning with these generated statements are suppressed; other copy remains visible.
const GENERATED_REVIEW_SECTION_PATTERNS = [
  /^This review evaluates .+ across feature depth, user experience, pricing value, and integration quality/i,
  /^.+ earns a \d(?:\.\d)?\/5 rating\. Best for teams that need reliable .+ capabilities with strong feature coverage/i,
  /^.+ achieves strong ratings across key evaluation categories/i,
  /^Founded in \d{4} and headquartered in .+ has grown to serve/i,
  /^.+ delivers comprehensive .+ functionality designed to address the most critical needs/i,
  /^We found .+'s interface to be intuitive and well-organized/i,
  /^.+ is best suited for .+ Organizations that need .+ enterprise-grade reliability/i,
  /^.+ delivers the core functionality expected from a platform in its category/i,
  /^.+ consistently outperforms competitors in reliability and feature depth/i,
  /^.+ has limitations that buyers should consider\. Support quality is rated at/i,
  /^Security features in .+ meet industry standards with encryption, access controls, and compliance certifications/i,
  /^.+ provides support through .+\. Premium tiers include dedicated account management and priority response/i,
  /^Most users can achieve basic proficiency within hours and master advanced features within days/i,
  /^Basic .+ setup takes 15-30 minutes for individual accounts/i,
  /^Migration to .+ is rated as Low complexity/i,
  /^.+ integrates with the major platforms in its ecosystem/i,
  /^.+ is deployed across multiple scenarios including .+\. Common implementations range from small team deployments/i,
  /^.+ serves .+ industries effectively/i,
  /^.+ competes with leading platforms in the .+ space/i,
  /^.+ earns a \d(?:\.\d)?\/5 rating and is recommended for/i,
  /^.+ scores: Features \d(?:\.\d)?/i,
  /^This review evaluates .+ across feature depth, user experience, pricing value, and integration quality to help you determine if it fits your .+ needs\./i,
  /^.+ earns a \d(?:\.\d)?\/5 rating\. Best for teams that need reliable .+ capabilities with strong feature coverage\. Pricing starts at /i,
  /^.+ achieves strong ratings across key evaluation categories including feature completeness, ease of use, customer support, value for money, and performance\./i,
  /^Founded in \d{4} and headquartered in .+ has grown to serve .+ users with .+ team members\./i,
  /^.+ delivers comprehensive .+ functionality designed to address the most critical needs in the .+ category\./i,
  /^.+ delivers comprehensive .+ functionality designed for .+\. The platform offers robust security features, comprehensive integration options/i,
  /^.+ delivers comprehensive .+ functionality designed for .+\. The platform is available via .+ with deployment options including /i,
  /^We found .+'s interface to be intuitive and well-organized\./i,
  /^.+ is best suited for .+ Organizations that need .+ enterprise-grade reliability will find .+ particularly valuable\./i,
  /^.+ delivers the core functionality expected from a platform in its category, with particular strength in the areas that matter most to its target users\./i,
  /^.+ consistently outperforms competitors in reliability and feature depth\./i,
  /^.+ has limitations that buyers should consider\. Support quality is rated at \d/i,
  /^Security features in .+ meet industry standards with encryption, access controls, and compliance certifications appropriate for its target market\./i,
  /^.+ delivers reliable performance with 99\.9% uptime SLA and consistent response times under load\./i,
  /^.+ provides support through .+\. Premium tiers include dedicated account management and priority response\. Support quality is rated at \d/i,
  /^.+ serves .+ industries effectively\./i,
  /^.+ competes with leading platforms in the .+ space\. Teams should evaluate alternatives based on /i,
  /^.+ earns a \d(?:\.\d)?\/5 rating and is recommended for /i,
  /^Most users can achieve basic proficiency within hours and master advanced features within days\./i,
  /^Basic .+ setup takes 15-30 minutes for individual accounts\. Organization-wide deployment typically requires 1-3 days/i,
  /^Migration to .+ is rated as Low complexity\. Standard import tools and API-based migration make it straightforward for most teams\./i,
  /^.+ integrates with the major platforms in its ecosystem, reducing the friction of adding it to an existing tool stack\./i,
  /^.+ is best suited for .+\. Organizations that need .+ capabilities with enterprise-grade reliability will find .+ particularly valuable\./i,
  /^.+ is deployed across multiple scenarios including .+\. Common implementations range from small team deployments to enterprise-wide rollouts serving thousands of users\./i,
  /^.+ delivers reliable performance with 99\.9% uptime SLA/i,
  /^.+(?:'s|’) primary advantage is .+\. The platform consistently outperforms competitors in reliability and feature depth\./i,
  /^The recorded profile lists these available capabilities: no feature availability details are recorded\./i,
  /^The recorded integration list includes no specific integrations in this profile\./i,
  /^The recorded target users are not specified, and the listed industries are not specified\./i,
  /^The profile records these security certifications: none listed; and these compliance items: none listed\./i,
  /^The current profile records these strengths: .+\. It also records these limitations:/i,
]

export function stripUnverifiedPriceClaims(value: string): string {
  const raw = String(value ?? "").trim()
  if (!raw) return ""
  const priceOrPlanClaim = /(?:starting at|starts at|from)?\\s*[$€£]\\s?\\d[\\d,]*(?:\\.\\d+)?(?:\\s*\\/\\s*(?:user|seat|month|year|mo|yr))?|\\b(?:USD|EUR|GBP)\\s?\\d[\\d,]*(?:\\.\\d+)?(?:\\s*\\/\\s*(?:user|seat|month|year|mo|yr))?|\\b\\d[\\d,]*(?:\\.\\d+)?\\s?(?:USD|EUR|GBP)\\b(?:\\s*\\/\\s*(?:user|seat|month|year|mo|yr))?|\\b(?:free|freemium|paid|enterprise)\\s+(?:plan|tier)\\b|\\bfree trial\\b/i
  const sentences = raw.split(/(?<=[.!?])\\s+|\\n+/).map((sentence) => sentence.trim()).filter(Boolean)
  return sentences.map((sentence) => priceOrPlanClaim.test(sentence) && !/not independently verified|verification pending/i.test(sentence)
    ? sentence + " (recorded value; not independently verified—confirm current terms with the vendor)"
    : sentence).join(" ").replace(/\\s{2,}/g, " ").trim()
}
export function getVisibleReviewContent(content: ContentSection[], showVerifiedPricing = false, showVerifiedRatings = false): ContentSection[] {
  return content
    .filter((section) => {
      if (!showVerifiedPricing && section.type === "diagram" && section.body === "pricing-ladder") return false
      if (!showVerifiedRatings && section.type === "diagram" && section.body === "feature-radar") return false
      if (!showVerifiedPricing && /pricing|plans/i.test(section.title)) return false
      if (HIDDEN_REVIEW_SECTION_TITLES.has(section.title)) return false
      if (GENERATED_REVIEW_SECTION_PATTERNS.some((pattern) => pattern.test(section.body.trim()))) return false
      if (section.type === "diagram") {
        return section.body === "implementation-flow" || (section.body === "pricing-ladder" && showVerifiedPricing) || (section.body === "feature-radar" && showVerifiedRatings)
      }
      return true
    })
    .map((section) => ({ ...section, body: section.type === "diagram" ? section.body : (showVerifiedPricing ? section.body : stripUnverifiedPriceClaims(section.body)) }))
}


// Hide repeated FAQ templates that assert security certifications, compliance, or
// enterprise capabilities without a product-specific evidence trail.
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
  const visibleFaqs = faqs.filter((faq) => {
    const question = faq.question.trim()
    const answer = faq.answer.trim()
    if (!showVerifiedFeatures && /\b(?:integrat(?:e|es|ion)|features?|support for|supports?|available on|mobile apps?|API access|security certifications?|compliance|SSO|data residency|deployment options)\b/i.test(question)) return false
    if (/^is .+ secure\?$/i.test(question) && /SOC 2 Type II|ISO 27001|FedRAMP|compliance with GDPR|CCPA|HIPAA|PCI DSS/i.test(answer)) return false
    if (/^is .+ GDPR compliant\?$/i.test(question) && /^yes, .+ is GDPR compliant with data processing agreements and data residency options\./i.test(answer)) return false
    if (/^is .+ good for enterprise teams\?$/i.test(question) && /serves enterprise organizations with .+ certifications? and scalable infrastructure/i.test(answer)) return false
    if (/^what are the main features of .+\?$/i.test(question) && /API access for custom integrations, and enterprise security with SOC 2 Type II/i.test(answer)) return false
    if (GENERATED_REVIEW_FAQ_PATTERNS.some((pattern) => pattern.test(answer))) return false
    return true
  })
  return showVerifiedPricing ? visibleFaqs : visibleFaqs.map((faq) => ({ question: stripUnverifiedPriceClaims(faq.question), answer: stripUnverifiedPriceClaims(faq.answer) }))
}
