import type { ContentSection } from "@/types/content"

const HIDDEN_REVIEW_SECTION_TITLES = new Set([
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
  /^.+ scores: Features \d(?:\.\d)?/i,
  /^Most users can achieve basic proficiency within hours and master advanced features within days\./i,
  /^Basic .+ setup takes 15-30 minutes for individual accounts\. Organization-wide deployment typically requires 1-3 days/i,
  /^Migration to .+ is rated as Low complexity\. Standard import tools and API-based migration make it straightforward for most teams\./i,
  /^.+ integrates with the major platforms in its ecosystem, reducing the friction of adding it to an existing tool stack\./i,
  /^.+ is best suited for .+\. Organizations that need .+ capabilities with enterprise-grade reliability will find .+ particularly valuable\./i,
  /^.+ is deployed across multiple scenarios including .+\. Common implementations range from small team deployments to enterprise-wide rollouts serving thousands of users\./i,
  /^.+ delivers reliable performance with 99\.9% uptime SLA and consistent response times under load\./i,
  /^.+ delivers reliable performance with 99\.9% uptime SLA/i,
  /^.+(?:'s|’) primary advantage is .+\. The platform consistently outperforms competitors in reliability and feature depth\./i,
]

export function getVisibleReviewContent(content: ContentSection[], showVerifiedPricing = false): ContentSection[] {
  return content.filter((section) => {
    if (!showVerifiedPricing && section.type === "diagram" && section.body === "pricing-ladder") return false
    if (!showVerifiedPricing && /pricing|plans/i.test(section.title)) return false
    if (HIDDEN_REVIEW_SECTION_TITLES.has(section.title)) return false
    if (GENERATED_REVIEW_SECTION_PATTERNS.some((pattern) => pattern.test(section.body.trim()))) return false
    if (section.type === "diagram") {
      return ["pricing-ladder", "feature-radar", "implementation-flow"].includes(section.body)
    }
    return true
  })
}
