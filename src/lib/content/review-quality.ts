import type { ContentSection, FAQItem } from "@/types/content"

const HIDDEN_REVIEW_SECTION_TITLES = new Set([
  // These are rendered in the page template already; keep all substantive review sections.
  "Quick Answer",
  "TL;DR",
  "Rating Overview",
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

export function isPricingPlaceholder(value: unknown): boolean {
  const text = typeof value === "string" ? value.trim() : ""
  if (!text) return true
  return /^(?:not independently verified(?:\b.*)?|not verified|check (?:the )?(?:(?:official|vendor) )?pricing|verify current terms directly with the vendor|see (?:the )?(?:(?:official|vendor) )?pricing|pricing (?:is )?not recorded|not recorded|unknown|n\/?a|none)$/i.test(text)
}

export function getReviewPricingSummary(priceRange?: string, pricing?: string, verified = false): string {
  const model = isPricingPlaceholder(pricing) ? "" : String(pricing).trim()
  const range = isPricingPlaceholder(priceRange) ? "" : String(priceRange).trim()
  const value = model && range ? `${model}: ${range}` : model || range
  if (!value) return "Current pricing is not independently verified; confirm plans and regional terms with the vendor."
  if (!verified && /[$€£]\s?\d|\b(?:USD|EUR|GBP)\s?\d|\b\d[\d,]*(?:\.\d+)?\s?(?:USD|EUR|GBP)\b/i.test(value)) return "Current pricing is not independently verified; confirm plans and regional terms with the vendor."
  return verified ? value : `${value} (recorded; not independently verified; confirm current terms with the vendor)`
}

export function stripUnverifiedPriceClaims(value: string): string {
  const raw = String(value ?? "").trim()
  if (!raw) return ""
  // Only flag currency amounts when the sentence is actually discussing commercial terms.
  // This avoids treating unrelated figures such as acquisition values or historical dates as SaaS pricing.
  const currencyAmount = /[$€£]\s?\d[\d,]*(?:\.\d+)?|\b(?:USD|EUR|GBP)\s?\d[\d,]*(?:\.\d+)?|\b\d[\d,]*(?:\.\d+)?\s?(?:USD|EUR|GBP)\b/i
  const planPhrase = /\b(?:free|freemium|paid|enterprise)\s+(?:plan|tier)\b|\bfree trial\b/i
  const pricingContext = /\b(?:price|pricing|costs?|plan|tier|subscription|billing|from|per (?:user|seat|editor)|starts? at|starting at|monthly|annually|annual|renewal|fee|licen[cs]e|pay(?:s|ment)?|budget)\b|\/(?:user\/)?month\b|\/year\b|\/seat\b/i
  // Do not repeat unsourced numeric prices to readers. Replace the entire price-bearing
  // sentence with an actionable verification instruction while preserving unrelated sentences.
  const priceSentences = raw
    .replace(/\s*\(recorded value; not independently verified[—-]confirm current terms with the vendor\)/gi, "")
    .split(/(?<=[.!?])\s+|\n+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
  const alreadyCaveated = (sentence: string) => /not independently verified|verification pending/i.test(sentence)
  const hasUnverifiedPrice = (sentence: string) =>
    currencyAmount.test(sentence) && (pricingContext.test(sentence) || sentence.trim().length <= 32)
  const hasUnverifiedPlan = (sentence: string) => planPhrase.test(sentence) && !alreadyCaveated(sentence)
  const replacedPriceSentence = priceSentences.some(hasUnverifiedPrice)
  const normalized = priceSentences.map((sentence) =>
    hasUnverifiedPrice(sentence)
      ? "Current pricing and plan entitlements are not independently verified; confirm current terms with the vendor."
      : sentence
  )
  const unique = [...new Set(normalized)]
  const text = unique.join(" ").replace(/\s{2,}/g, " ").trim()
  if (!replacedPriceSentence && priceSentences.some(hasUnverifiedPlan)) {
    return text + " (Pricing and plan details are not independently verified; confirm current terms with the vendor.)"
  }
  return text
}

function replacementForUnverifiedSection(title: string, productName = "this product"): string {
  const normalized = title.toLowerCase()
  if (/pricing|plans|cost|hidden costs/.test(normalized)) {
    return `Pricing details for ${productName} are not independently verified in this review. Check the current official pricing page and confirm included features, billing cadence, usage limits, add-ons, taxes, renewal terms, and regional availability before comparing total cost.`
  }
  if (/security|privacy|compliance/.test(normalized)) {
    return `Security and compliance claims for ${productName} require product-, plan-, and region-specific evidence. Review current vendor trust documentation, data-processing terms, access controls, data retention, deletion/export options, and the scope and date of any independent audit before adoption.`
  }
  if (/performance|reliability|uptime|setup time|implementation|adoption|rollout|migration/.test(normalized)) {
    return `No independent benchmark or implementation timing is asserted for ${productName} here. Test a representative workload or dataset, record a baseline, measure task completion time and errors, and document migration dependencies and rollback options before making a commitment.`
  }
  if (/support|documentation|learning curve/.test(normalized)) {
    return `Support and onboarding quality have not been independently measured for ${productName}. Confirm available support channels, response commitments, service hours, documentation coverage, training resources, and escalation terms for the plan you would actually purchase.`
  }
  if (/feature|integration|capabilit/.test(normalized)) {
    return `Treat the recorded capability notes for ${productName} as a checklist, not a verified guarantee. Confirm each must-have feature, integration, permission, export path, and plan restriction in current official documentation, then test it in your own workflow.`
  }
  if (/strength|trade-off|\\bpros\\b|\\bcons\\b|limitation/.test(normalized)) {
    return `Treat any listed strength of ${productName} as a hypothesis to test, not an independently verified finding. Choose two representative tasks, compare completion time and manual work with your current process, then record blockers, workarounds, failure cases, and ongoing administration. A useful trade-off statement should identify who benefits, what constraint appears, and the evidence behind that conclusion.`
  }
  if (/who should|fit|workflow|industry|target user|use case/.test(normalized)) {
    return `Assess ${productName} against the team's actual workflow rather than a broad industry label. Name the primary user, administrator, must-have task, required integrations, data-access rules, and measurable success condition. Run the same scenario with representative data and include an exception case before deciding whether the product fits.`
  }
  if (/decision|buying|pilot|checklist|evaluation/.test(normalized)) {
    return `Use this ${title.toLowerCase()} section to create a short acceptance plan for ${productName}: list the required outcome, the test input, the expected result, the person responsible, and pass/fail criteria. Record unknowns separately, confirm plan limits with the vendor, and keep a rollback option until the team signs off.`
  }
  return `For ${productName}, evaluate “${title}” against a documented requirement rather than assuming a generic claim is true. These claims are not independently verified yet. Define a representative task, the expected outcome, the source needed to verify the claim, and a failure case. Mark results as pass, partial pass, fail, or unknown, and record the test date so readers can distinguish verified findings from items still to check.`
}

export function getVisibleReviewContent(content: ContentSection[], showVerifiedPricing = false, showVerifiedRatings = false, productName = "this product"): ContentSection[] {
  return content
    .filter((section) => !HIDDEN_REVIEW_SECTION_TITLES.has(section.title))
    .map((section) => {
      if (section.type === "diagram" && section.body === "pricing-ladder" && !showVerifiedPricing) {
        return { ...section, type: "text" as const, body: replacementForUnverifiedSection(section.title, productName), items: section.items }
      }
      if (section.type === "diagram" && section.body === "feature-radar" && !showVerifiedRatings) {
        return { ...section, type: "text" as const, body: replacementForUnverifiedSection(section.title, productName), items: section.items }
      }
      const trimmedBody = section.body.trim()
      const genericPricingPlaceholder = /^(?:pricing details(?: at a glance)?|pricing information|current pricing|plans and pricing)\.?$/i.test(trimmedBody)
      const unverifiedPricingPlaceholder = !showVerifiedPricing && /pricing|plans|cost|hidden costs/i.test(section.title) && genericPricingPlaceholder
      const generatedClaim = GENERATED_REVIEW_SECTION_PATTERNS.some((pattern) => pattern.test(trimmedBody))
      const body = unverifiedPricingPlaceholder || generatedClaim
        ? replacementForUnverifiedSection(section.title, productName)
        : (showVerifiedPricing ? section.body : stripUnverifiedPriceClaims(section.body))
      const items = section.items?.map((item) =>
        GENERATED_REVIEW_SECTION_PATTERNS.some((pattern) => pattern.test(item.trim()))
          ? replacementForUnverifiedSection(section.title, productName)
          : (showVerifiedPricing ? item : stripUnverifiedPriceClaims(item))
      )
      return { ...section, body, items }
    })
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
