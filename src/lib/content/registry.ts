import type { ReviewContent, ComparisonContent, ComparisonFeature, GuideContent, GlossaryContent, BlogContent, CategoryKnowledge, AlternativeContent, UseCaseContent, IndustryContent, ResearchContent, StatisticContent, BestContent, HubContent, FAQItem, ContentSection } from "@/types/content"
import fs from "node:fs"
import path from "node:path"
import { isNoindexed } from "@/lib/noindex"

const CONTENT_DIR = path.resolve(process.cwd(), "content")

const DIR_FOR_TYPE: Record<string, string> = {
  review: "reviews",
  comparison: "comparisons",
  guide: "guides",
  blog: "blog",
  glossary: "glossary",
  alternative: "alternatives",
  best: "best",
  "use-case": "use-cases",
  industry: "industries",
  research: "research",
  statistic: "statistics",
  hub: "hubs",
}

// Content types whose templates emit a real noindex meta tag and that sitemap.ts filters.
// Blog, research, use-cases, industries and hubs carry no noindex entries, so their slugs
// stay linkable; guides are enforced like reviews and comparisons.
const NOINDEX_ENFORCED = new Set(["review", "comparison", "guide", "best", "alternative", "glossary", "statistic", "use-case", "industry", "research", "hub"])

/**
 * True when a content slug resolves to a page that is published, reachable and indexable.
 * Use this before emitting an internal link so we never send users or crawlers to
 * unpublished or suppressed content.
 */
// Link generation can ask about the same candidate from many statically generated
// pages. Cache this build-time decision to avoid repeatedly parsing and sanitizing the
// same content file for every internal-link candidate.
const contentAvailabilityCache = new Map<string, boolean>()

export function isContentAvailable(type: string, slug: string): boolean {
  const dir = DIR_FOR_TYPE[type]
  if (!dir || !slug) return false
  const key = `${type}:${slug}`
  const cached = contentAvailabilityCache.get(key)
  if (cached !== undefined) return cached

  const available = getContentTitle(type, slug) !== null &&
    (!NOINDEX_ENFORCED.has(type) || !isNoindexed(dir, slug))
  contentAvailabilityCache.set(key, available)
  return available
}

const DATE_FIELDS = new Set(["lastUpdated", "contentPublished", "contentModified", "publishedAt", "updatedAt", "datePublished", "dateModified"])

const GENERIC_REVIEW_SECTION_TITLES = new Set(["Rating Overview","Key Features","Hidden Costs","Learning Curve","Setup Time","Migration Difficulty","Industry Fit","Common Mistakes","Tips from experienced users","Buying Advice"])

const GENERIC_BOILERPLATE_PATTERNS = [
  /our expert team evaluated/i,
  /our methodology combines hands-on product testing/i,
  /case study 1 - aerospace/i,
  /case study 2 - healthcare/i,
  /case study 3 - finance/i,
  /response times: sub-second p50/i,
  /break-even typically 3-6 months/i,
  /first-year roi of 150-300%/i,
  /1000\+ pre-built connectors/i,
  /week 1: discovery, planning, requirements gathering/i,
  /weighted criteria: features 25%, ease of use 20%/i,
  /cloud-native deployment on aws\/gcp\/azure/i,
  /hands-on testing/i,
  /tested for at least two weeks/i,
  /based on our testing methodology/i,
  /this review is based on hands-on testing/i,
  /we verify our hands-on testing/i,
  /tested in realistic workflows by our team/i,
  /after researching hundreds of/i,
  /our expert buying advice/i,
  /enterprise deployments consistently demonstrate/i,
  /this approach enables teams to maximize their software investment/i,
  /organizations see measurable improvements in efficiency and user satisfaction within the first quarter/i,
  /organizations see measurable improvements in efficiency and team productivity/i,
]

const UNSUPPORTED_CLAIM_PATTERNS = [
  /hands[- ]on testing/i,
  /tested for at least two weeks/i,
  /based on our testing methodology/i,
  /this review is based on hands[- ]on testing/i,
  /we verify our hands[- ]on testing/i,
  /tested in realistic workflows by our team/i,
  /our expert team evaluated/i,
  /our testing methodology/i,
  /after researching hundreds of/i,
  /our expert buying advice/i,
  /based on our detailed comparison/i,
  /our analysis incorporates thousands/i,
  /our experts?\b/i,
  /we tested\b/i,
  /tested by our team/i,
  /user(s)? consistently report/i,
  /organizations see measurable improvements/i,
  /typical roi payback/i,
  /first-year roi/i,
]

function sanitizeUnsupportedClaims(value: string | undefined): string {
  const raw = String(value ?? "").trim()
  if (!raw) return ""
  const normalized = raw
    .replace(/\bverified picks?\b/gi, "selected picks")
    .replace(/\bafter thorough evaluation\b/gi, "based on the comparison criteria")
  return normalized
    .split("\n")
    .map((line) =>
      line
        .split(/(?<=[.!?])\s+/)
        .map((sentence) => sentence.trim())
        .filter((sentence) => sentence && !UNSUPPORTED_CLAIM_PATTERNS.some((pattern) => pattern.test(sentence)))
        .join(" ")
    )
    .filter(Boolean)
    .join("\n")
    .trim()
}

function sanitizeContentValue(value: unknown): unknown {
  if (typeof value === "string") return sanitizeUnsupportedClaims(value)
  if (Array.isArray(value)) return value.map(sanitizeContentValue)
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      out[key] = key === "author" && typeof child === "string" ? "PilotStack Team" : sanitizeContentValue(child)
    }
    return out
  }
  return value
}

const GENERIC_LIST_ITEM_PATTERNS = [
  /^regular product updates$/i,
  /^strong customer support$/i,
  /^good mobile experience$/i,
  /^active user community$/i,
]

const GENERIC_FAQ_ANSWER_PATTERNS = [
  /based on our detailed comparison/i,
  /our analysis incorporates thousands/i,
  /hands-on assessments/i,
  /after researching hundreds/i,
  /we tested/i,
  /our experts?/i,
]

const GENERIC_FAQ_PATTERNS = [
  /^what is the best .* software\??$/i,
  /^how much does .* software cost\??$/i,
  /^what features should i look for in .* software\??$/i,
  /^how do i choose the right .* (tool|software)\??$/i,
  /^is free .* software good enough\??$/i,
  /^how often should i reevaluate .* (tool|software)\??$/i,
]

function sanitizeFaqs(faqs: FAQItem[] | undefined): FAQItem[] {
  if (!Array.isArray(faqs)) return []
  const seen = new Set<string>()
  const cleaned: FAQItem[] = []
  for (const faq of faqs) {
    const question = sanitizeUnsupportedClaims(String(faq?.question ?? "").trim())
    const answer = sanitizeUnsupportedClaims(String(faq?.answer ?? "").trim())
    const key = question.toLowerCase().replace(/\s+/g, " ")
    if (!question || !answer || !question.endsWith("?") || seen.has(key)) continue
    if (GENERIC_FAQ_PATTERNS.some((pattern) => pattern.test(key))) continue
    if (GENERIC_FAQ_ANSWER_PATTERNS.some((pattern) => pattern.test(answer))) continue
    if (answer.length < 40 || answer.length > 700) continue
    seen.add(key)
    cleaned.push({ question, answer })
    if (cleaned.length >= 5) break
  }
  return cleaned
}

function sanitizeSections<T extends { title: string; body: string }>(sections: T[] | undefined): T[] {
  if (!Array.isArray(sections)) return []
  return sections
    .map((section) => ({
      ...section,
      body: sanitizeUnsupportedClaims(section?.body),
    }))
    .filter((section) => {
      if (!section?.title || !section?.body) return false
      if (GENERIC_REVIEW_SECTION_TITLES.has(section.title)) return false
      if (GENERIC_BOILERPLATE_PATTERNS.some((pattern) => pattern.test(section.body))) return false
      return true
    })
}

function trimText(value: string | undefined, max: number): string {
  const text = String(value ?? "").trim()
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const boundary = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("! "), cut.lastIndexOf("? "))
  return (boundary > Math.floor(max * 0.65) ? cut.slice(0, boundary + 1) : cut).trim()
}

function sanitizeList(items: string[] | undefined, max = 5): string[] {
  if (!Array.isArray(items)) return []
  const seen = new Set<string>()
  return items
    .map((item) => trimText(String(item ?? ""), 360))
    .filter((item) => item.length >= 12 && !GENERIC_LIST_ITEM_PATTERNS.some((pattern) => pattern.test(item)))
    .filter((item) => {
      const key = item.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .slice(0, max)
}

function sanitizeReview(review: ReviewContent): ReviewContent {
  return {
    ...review,
    content: sanitizeSections(review.content).filter((section) => !(section.type === "diagram" && !["pricing-ladder","feature-radar","implementation-flow"].includes(section.body))),
    description: trimText(review.description, 700),
    tagline: trimText(review.tagline, 220),
    pros: sanitizeList(review.pros),
    cons: sanitizeList(review.cons),
    features: review.features.map((feature) => ({ ...feature, name: trimText(feature.name, 120), description: trimText(feature.description, 360) })).slice(0, 20),
    faqs: sanitizeFaqs(review.faqs),
  }
}


function toISODate(date: string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return date
  return d.toISOString().slice(0, 10)
}

// Content templates call the getAll* helpers once per component, and the link-availability
// guards call the single-slug helpers once per candidate. Without a cache each of those calls
// re-reads every file in the directory, which pushes static generation past the per-page
// timeout. The cache is keyed on mtime so a content edit is still picked up without a restart.
const jsonCache = new Map<string, { mtimeMs: number; data: unknown }>()

function readJson<T>(filePath: string): T {
  let mtimeMs = -1
  try {
    mtimeMs = fs.statSync(filePath).mtimeMs
  } catch {
    // Missing file — fall through to readFileSync so it throws exactly as before.
  }
  const cached = jsonCache.get(filePath)
  if (cached && cached.mtimeMs === mtimeMs) return cached.data as T

  const raw = fs.readFileSync(filePath, "utf-8")
  const parsed = JSON.parse(raw) as Record<string, unknown>
  for (const key of Object.keys(parsed)) {
    if (DATE_FIELDS.has(key) && typeof parsed[key] === "string") {
      parsed[key] = toISODate(parsed[key] as string)
    }
  }
  const data = sanitizeContentValue(parsed) as Record<string, unknown>
  if (mtimeMs !== -1) jsonCache.set(filePath, { mtimeMs, data })
  return data as T
}

function readDir(dir: string): string[] {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
  } catch {
    return []
  }
}

export function getReview(slug: string): ReviewContent | null {
  const file = path.join(CONTENT_DIR, "reviews", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return sanitizeReview(readJson<ReviewContent>(file))
}

export function getAllReviews(): ReviewContent[] {
  return readDir(path.join(CONTENT_DIR, "reviews"))
    .map((f) => sanitizeReview(readJson<ReviewContent>(path.join(CONTENT_DIR, "reviews", f))))
    .sort((a, b) => b.rating - a.rating)
}

function sectionWordCount(sections: Array<{ body?: string; items?: string[] }>): number {
  return sections.reduce((total, section) =>
    total + String(section.body ?? "").split(/\s+/).filter(Boolean).length +
    (section.items || []).reduce((n, item) => n + String(item).split(/\s+/).filter(Boolean).length, 0),
  0)
}

function buildDerivedComparisonFeatures(cmp: ComparisonContent, base: ComparisonFeature[]): ComparisonFeature[] {
  const r1 = getReview(cmp.tool1Slug)
  const r2 = getReview(cmp.tool2Slug)
  if (!r1 && !r2) return base
  const genericNames = new Set(["user rating", "category", "starting price", "best for", "core strength", "ease of use", "integration ecosystem"])
  const looksGeneric = base.length <= 6 && base.every((f) => genericNames.has(f.name.toLowerCase()))
  if (!looksGeneric && base.length > 5) return base
  const integrations1 = Array.isArray(r1?.company?.integrations) ? r1.company.integrations : []
  const integrations2 = Array.isArray(r2?.company?.integrations) ? r2.company.integrations : []
  const certifications1 = Array.isArray(r1?.company?.securityCertifications) ? r1.company.securityCertifications : []
  const certifications2 = Array.isArray(r2?.company?.securityCertifications) ? r2.company.securityCertifications : []
  const compliance1 = Array.isArray(r1?.company?.compliance) ? r1.company.compliance : []
  const compliance2 = Array.isArray(r2?.company?.compliance) ? r2.company.compliance : []
  const features1 = Array.isArray(r1?.features) ? r1.features : []
  const features2 = Array.isArray(r2?.features) ? r2.features : []
  const derived: ComparisonFeature[] = [
    { name: "User Rating", tool1: Boolean(r1), tool2: Boolean(r2), tool1Detail: r1 ? `${r1.rating}/5 across ${r1.reviewCount.toLocaleString()} recorded reviews` : undefined, tool2Detail: r2 ? `${r2.rating}/5 across ${r2.reviewCount.toLocaleString()} recorded reviews` : undefined },
    { name: "Pricing", tool1: Boolean(r1), tool2: Boolean(r2), tool1Detail: r1 ? `${r1.pricing}${r1.priceRange ? `: ${r1.priceRange}` : ""}` : undefined, tool2Detail: r2 ? `${r2.pricing}${r2.priceRange ? `: ${r2.priceRange}` : ""}` : undefined },
    { name: "Category & Positioning", tool1: Boolean(r1), tool2: Boolean(r2), tool1Detail: r1 ? `${r1.category}. ${r1.tagline}` : cmp.category, tool2Detail: r2 ? `${r2.category}. ${r2.tagline}` : cmp.secondaryCategories?.[0] || cmp.category },
    { name: "Key Capabilities", tool1: Boolean(r1?.features?.length), tool2: Boolean(r2?.features?.length), tool1Detail: features1.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(", ") || undefined, tool2Detail: features2.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(", ") || undefined },
    { name: "Integrations", tool1: Boolean(r1?.company?.integrations?.length), tool2: Boolean(r2?.company?.integrations?.length), tool1Detail: integrations1.slice(0, 6).join(", "), tool2Detail: integrations2.slice(0, 6).join(", ") },
    { name: "API", tool1: Boolean(r1?.company), tool2: Boolean(r2?.company), tool1Detail: r1?.company ? (r1.company.apiAvailable ? "API available in the recorded profile." : "API is not marked available in the recorded profile.") : undefined, tool2Detail: r2?.company ? (r2.company.apiAvailable ? "API available in the recorded profile." : "API is not marked available in the recorded profile.") : undefined },
    { name: "Security & Compliance", tool1: Boolean(r1?.company), tool2: Boolean(r2?.company), tool1Detail: r1?.company ? [...certifications1, ...compliance1].slice(0, 8).join(", ") || "No specific certifications recorded." : undefined, tool2Detail: r2?.company ? [...certifications2, ...compliance2].slice(0, 8).join(", ") || "No specific certifications recorded." : undefined },
    { name: "Migration", tool1: Boolean(r1?.company), tool2: Boolean(r2?.company), tool1Detail: r1?.company ? r1.company.migrationComplexity : undefined, tool2Detail: r2?.company ? r2.company.migrationComplexity : undefined },
  ]
  const existingNames = new Set(base.map((f) => f.name.toLowerCase()))
  return [...base, ...derived.filter((f) => !existingNames.has(f.name.toLowerCase()))].slice(0, 20)
}
function normalizeComparisonWinner(value: string | null, tool1: string, tool2: string): string | null {
  if (!value) return null
  if (value.toLowerCase() === tool1.toLowerCase()) return tool1
  if (value.toLowerCase() === tool2.toLowerCase()) return tool2
  return null
}

function buildComparisonNarrative(tool1: string, tool2: string, tool1Slug: string, tool2Slug: string, features: ComparisonFeature[], winner: string | null): string {
  const exclusive1 = features.filter((f) => Boolean(f.tool1) && !Boolean(f.tool2))
  const exclusive2 = features.filter((f) => Boolean(f.tool2) && !Boolean(f.tool1))
  const shared = features.filter((f) => Boolean(f.tool1) && Boolean(f.tool2))
  const review1 = getReview(tool1Slug)
  const review2 = getReview(tool2Slug)
  const winnerLine = winner
    ? `${winner} is the recorded winner in this dataset.`
    : "The dataset does not record a clear overall winner."

  const evidence = (items: ComparisonFeature[], key: "tool1Detail" | "tool2Detail") =>
    items
      .slice(0, 5)
      .map((f) => `${f.name}: ${String(f[key] || "recorded as available.")}`)
      .join(" ")

  const lead1 = exclusive1.length
    ? `${tool1} has exclusive coverage for ${exclusive1.slice(0, 5).map((f) => f.name.toLowerCase()).join(", ")}.`
    : `${tool1} has no exclusive criteria in the recorded feature set.`
  const lead2 = exclusive2.length
    ? `${tool2} has exclusive coverage for ${exclusive2.slice(0, 5).map((f) => f.name.toLowerCase()).join(", ")}.`
    : `${tool2} has no exclusive criteria in the recorded feature set.`

  const pricingContext = [review1, review2].filter(Boolean).map((review) =>
    `${review!.name} is recorded at ${review!.rating}/5 with ${review!.pricing.toLowerCase()} pricing${review!.priceRange ? ` (${review!.priceRange})` : ""}.`
  ).join(" ")

  const featureEvidence1 = evidence(exclusive1, "tool1Detail")
  const featureEvidence2 = evidence(exclusive2, "tool2Detail")
  const switching = `Before switching between ${tool1} and ${tool2}, verify the workflows represented by the criteria above, confirm current pricing on the vendor sites, and check export/import support, authentication, integrations, and user migration requirements. Recorded feature coverage is a comparison signal, not proof that one product is better for every team.`

  const profile1 = review1 ? review1.name + ' is recorded at ' + review1.rating + '/5. Its positioning is ' + review1.tagline + '. The profile lists ' + review1.features.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(', ') + ' as available capabilities.' : ''
  const profile2 = review2 ? review2.name + ' is recorded at ' + review2.rating + '/5. Its positioning is ' + review2.tagline + '. The profile lists ' + review2.features.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(', ') + ' as available capabilities.' : ''
  return [
    winnerLine,
    `This comparison covers ${features.length} recorded criteria. ${shared.length} criteria are marked as available for both products, ${exclusive1.length} are exclusive to ${tool1}, and ${exclusive2.length} are exclusive to ${tool2}. The most useful way to read the table is to focus on the criteria that map directly to the workflow you are replacing or improving.`,
    profile1,
    profile2,
    lead1 + (featureEvidence1 ? ` In the recorded detail, ${featureEvidence1}` : '') + ' ' + lead2 + (featureEvidence2 ? ` In the recorded detail, ${featureEvidence2}` : ''),
    pricingContext,
    `For the final choice, separate must-have requirements from preferences. A product with more recorded criteria is not automatically the better fit if the additional capabilities are irrelevant to your team. Likewise, a smaller feature footprint can be an advantage when it reduces configuration or training effort.`,
    switching,
  ].filter(Boolean).join("\n\n")
}
function sanitizeComparisonDescription(description: string, tool1: string, tool2: string, features: ComparisonFeature[], winner: string | null): string {
  const cleaned = sanitizeUnsupportedClaims(description).replace(/\s+/g, " ").trim()
  const malformedPricing = /\bfrom\s+Free\s*[–—-]\s*(?:[.,;]|$)/i.test(cleaned)
    || /\b(?:from|starting at)\s*(?:–|—|-)?\s*[.,;](?:\s|$)/i.test(cleaned)
  const containsPlaceholder = /\b(?:NaN|undefined|null)\b/i.test(cleaned)
  if (cleaned.length >= 80 && !malformedPricing && !containsPlaceholder && !/are paramount|including advanced\s*,|verify and compliance|our expert|we (?:evaluated|tested|researched) hundreds/i.test(cleaned)) {
    return trimText(cleaned, 700)
  }
  return trimText("Compare " + tool1 + " and " + tool2 + " across " + features.length + " recorded criteria, including feature availability, pricing considerations, integrations, security, and workflow fit. " + (winner ? winner + " is the recorded overall winner." : "The dataset records no single overall winner.") + " Read the detailed rows and linked reviews before making a decision.", 700)
}
export function getComparison(slug: string): ComparisonContent | null {
  const file = path.join(CONTENT_DIR, "comparisons", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const cmp = readJson<ComparisonContent>(file)
  const baseFeatures = cmp.features.slice(0, 20).map((f) => ({
    ...f,
    name: trimText(f.name, 140),
    tool1Detail: sanitizeUnsupportedClaims(trimText(f.tool1Detail, 320)),
    tool2Detail: sanitizeUnsupportedClaims(trimText(f.tool2Detail, 320)),
  }))
  const features = buildDerivedComparisonFeatures(cmp, baseFeatures)
  const winner = normalizeComparisonWinner(cmp.winner, cmp.tool1, cmp.tool2)
  return {
    ...cmp,
    winner,
    description: sanitizeComparisonDescription(cmp.description, cmp.tool1, cmp.tool2, features, winner),
    verdict: buildComparisonNarrative(cmp.tool1, cmp.tool2, cmp.tool1Slug, cmp.tool2Slug, features, winner),
    features,
    faqs: sanitizeFaqs(cmp.faqs),
  }
}
export function getAllComparisons(): ComparisonContent[] {
  return readDir(path.join(CONTENT_DIR, "comparisons"))
    .map((f) => getComparison(f.replace(/\.json$/, "")))
    .filter((x): x is ComparisonContent => Boolean(x))
}

/** Load only comparisons assigned to a category before building expensive derived narratives. */
export function getComparisonsByCategory(category: string): ComparisonContent[] {
  return readDir(path.join(CONTENT_DIR, "comparisons"))
    .filter((file) => {
      const raw = readJson<ComparisonContent>(path.join(CONTENT_DIR, "comparisons", file))
      return raw.category === category || raw.secondaryCategories?.includes(category)
    })
    .map((file) => getComparison(file.replace(/\.json$/, "")))
    .filter((item): item is ComparisonContent => Boolean(item))
}

function prepareGuide(guide: GuideContent): GuideContent {
  const sections = buildGuideSections(guide)
  const isTemplateDescription = /how to evaluate the right|choosing the right .* software starts with/i.test(guide.description || "")
  const topic = guide.title.replace(/\\s*[:—-].*$/, "").trim() || guide.category
  const description = isTemplateDescription
    ? `${topic}: practical ${guide.category.toLowerCase()} guidance with category-specific checks, implementation risks, and a repeatable pilot checklist. Verify changing product details with primary sources before deciding.`
    : guide.description
  return {
    ...guide,
    description,
    sections,
    readingTime: Math.max(4, Math.ceil(sectionWordCount(sections) / 220)),
    faqs: sanitizeFaqs(guide.faqs),
  }
}

export function getGuide(slug: string): GuideContent | null {
  const file = path.join(CONTENT_DIR, "guides", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return prepareGuide(readJson<GuideContent>(file))
}

export function getAllGuides(): GuideContent[] {
  return readDir(path.join(CONTENT_DIR, "guides"))
    .map((f) => prepareGuide(readJson<GuideContent>(path.join(CONTENT_DIR, "guides", f))))
}

export function getGlossaryTerm(slug: string): GlossaryContent | null {
  const file = path.join(CONTENT_DIR, "glossary", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<GlossaryContent>(file)
}

export function getAllGlossaryTerms(): GlossaryContent[] {
  return readDir(path.join(CONTENT_DIR, "glossary"))
    .map((f) => readJson<GlossaryContent>(path.join(CONTENT_DIR, "glossary", f)))
    .sort((a, b) => a.term.localeCompare(b.term))
}

function enrichBlogBody(post: BlogContent): string {
  const body = String(post.body || "").trim()
  const words = body.split(/\s+/).filter(Boolean).length
  if (words >= 850) return body

  const tags = post.tags.filter(Boolean).slice(0, 4).join(", ")
  const pricing = /pricing|price|cost|budget|roi|spend/i.test(post.title + " " + body)
  const comparison = /\bvs\b|versus|comparison|compare/i.test(post.title)
  const focus = pricing
    ? "total cost, plan limits, usage assumptions, and the implementation effort that sits outside the headline subscription price"
    : comparison
      ? "workflow fit, meaningful feature differences, integrations, adoption effort, and the trade-offs behind the headline winner"
      : "workflow fit, integration requirements, administration, adoption, and the evidence a buyer should check before choosing"

  const sections = [
    `## What matters when evaluating ${post.category.toLowerCase()} software

This topic is most useful when it is connected to a real decision rather than treated as a feature checklist. For this article, the main evaluation lens should be ${focus}. Start with the job the software needs to perform, identify the steps that are currently slow or manual, and then map those requirements to the products or approaches discussed here. The important question is not whether a platform has a long feature list; it is whether the features reduce meaningful work for the people who will use and administer the product.`,
    `## Questions to verify before you choose

Use the article as a starting point and verify the details that can change over time. Check the vendor's current pricing and plan limits, the integrations your workflow actually depends on, export or migration options, permissions and administrative controls, and any security or compliance requirements that apply to your organization. Where this article references ${tags || "specific tools"}, treat the recorded information as a comparison aid and confirm time-sensitive facts against the linked primary source before signing a contract.`,
    `## Practical decision framework

A useful shortlist normally has a clear must-have set, a small group of preferred capabilities, and explicit reasons to reject an option. Define the critical workflow first, test the highest-risk requirement with realistic sample data, estimate the total cost at your expected team size, and document what would still require a workaround. Revisit the decision after rollout: adoption, support burden, integration reliability, and actual usage are stronger signals of fit than a product's marketing claims alone.`,
    `## Keeping this decision current

Software products change frequently. Recheck pricing, feature availability, integrations, security documentation, and product limits when the buying decision becomes active. The article's publication date and linked sources provide context, while the current vendor documentation should be the final authority for contractual or technical details.`,
  ]
  return [body, ...sections].filter(Boolean).join("\n\n")
}

export function getBlogPost(slug: string): BlogContent | null {
  const file = path.join(CONTENT_DIR, "blog", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const post = readJson<BlogContent>(file)
  return { ...post, body: enrichBlogBody(post) }
}

export function getAllBlogPosts(): BlogContent[] {
  return readDir(path.join(CONTENT_DIR, "blog"))
    .map((f) => {
      const post = readJson<BlogContent>(path.join(CONTENT_DIR, "blog", f))
      return { ...post, body: enrichBlogBody(post) }
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}

export function getCategory(slug: string): CategoryKnowledge | null {
  const file = path.join(CONTENT_DIR, "categories", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const category = readJson<CategoryKnowledge>(file)
  category.faqs = sanitizeFaqs(category.faqs)
  return category
}

export function getAllCategories(): CategoryKnowledge[] {
  return readDir(path.join(CONTENT_DIR, "categories"))
    .map((f) => { const c = readJson<CategoryKnowledge>(path.join(CONTENT_DIR, "categories", f)); c.faqs = sanitizeFaqs(c.faqs); return c })
}

function sanitizeAlternativeTitle(title: string, toolName: string, count: number): string {
  const cleaned = title.replace(/\s+/g, " ").trim()
  if (!cleaned || /save\s*\+|\+\/year|\+\s*\/\s*year|\btested\b/i.test(cleaned)) {
    return `${toolName} Alternatives (2026): ${count} Options to Consider`
  }
  return trimText(cleaned, 70)
}

function sanitizeAlternativeDescription(description: string, toolName: string, count: number): string {
  const cleaned = sanitizeUnsupportedClaims(description).replace(/\s+/g, " ").trim()
  if (cleaned.length >= 90 && !/save\s*\+|\+\/year|\btested\b/i.test(cleaned)) return trimText(cleaned, 700)
  return `Compare ${count} ${toolName} alternatives using recorded ratings, practical fit, pricing context, integrations, and migration considerations. Use the linked product reviews to verify current details before choosing.`
}
function buildGuideSections(guide: GuideContent): GuideContent['sections'] {
  const rawSections = sanitizeSections(guide.sections)
  const boilerplatePatterns = [
    /Choosing the right .* software starts with understanding your specific requirements/i,
    /take stock of your team size, budget, existing tool stack/i,
    /focus on these criteria: feature completeness relative to your needs/i,
    /This guide walks through the key considerations/i,
    /Most teams see positive ROI within 3-6 months/i,
    /The most common mistakes teams make with/i,
    /This section is foundational — take time to understand it/i,
  ]
  const sections = rawSections.filter((section) =>
    !boilerplatePatterns.some((pattern) => pattern.test(section.body))
  )
  if (sectionWordCount(sections) >= 900) return sections

  const category = guide.category || "software"
  const slug = guide.slug.toLowerCase()
  const topic = guide.title.replace(/\s*[:—-].*$/, "").trim() || category
  const categoryProfiles: Record<string, { evidence: string; checks: string; risks: string }> = {
    "AI & Machine Learning": {
      evidence: "model quality on representative tasks, repeatability, data retention, human review, model or prompt versioning, and usage limits",
      checks: "quality against a held-out sample, handling of sensitive data, failure behavior, latency under realistic load, monitoring, and the cost of retries",
      risks: "unreviewed outputs entering customer workflows, sensitive data reaching an unapproved provider, model changes altering results, and usage costs growing without alerts",
    },
    "Project Management": {
      evidence: "dependencies, workload capacity, recurring work, portfolio reporting, guest permissions, automation limits, and how task status is maintained",
      checks: "a real project with dependencies, a recurring workflow, cross-team visibility, access roles, notifications, exports, and reporting accuracy",
      risks: "duplicated task systems, dashboards no one maintains, automations that hide ownership, and plans whose limits break the team's normal workflow",
    },
    "CRM & Sales": {
      evidence: "contact and account quality, pipeline definitions, activity capture, forecasting, permissions, reporting, and synchronization with marketing or support",
      checks: "deduplication, ownership changes, pipeline stages, imports and exports, audit history, role permissions, and the handoff between teams",
      risks: "migrating dirty records, changing pipeline definitions without agreement, over-permissioned data, and measuring activity instead of sales outcomes",
    },
    "Marketing & SEO": {
      evidence: "measurement goals, consent-aware tracking, channel definitions, conversion quality, attribution windows, CRM handoffs, and reconciliation with source data",
      checks: "a known test conversion, campaign tagging, consent behavior, cross-domain journeys, bot filtering, export access, and the difference between modeled and observed data",
      risks: "double-counted conversions, broken tags, unclear attribution windows, privacy gaps, and optimizing for cheap leads rather than qualified outcomes",
    },
    "Design & Creative": {
      evidence: "component reuse, review and handoff, asset ownership, accessibility, version history, export formats, and design-to-development collaboration",
      checks: "a representative file, shared libraries, permission boundaries, revision recovery, developer handoff, and exports that preserve required details",
      risks: "design systems that drift, inaccessible components, unclear asset ownership, and workflows that depend on manual copying between tools",
    },
    "Developer Tools": {
      evidence: "repository and CI integration, access control, API limits, test reliability, observability, rollback paths, and operational ownership",
      checks: "a real repository or service, failed-build handling, secrets management, permissions, API quotas, alert routing, and recovery from a bad change",
      risks: "flaky automation, exposed credentials, noisy alerts, hidden usage limits, and tools that only work when one engineer maintains them",
    },
    "Analytics & Data": {
      evidence: "event and metric definitions, data freshness, lineage, access controls, exportability, governance, and storage or query costs",
      checks: "reconciling a known number against its source, late-arriving data, permissions, refresh failures, schema changes, and exporting usable records",
      risks: "conflicting metric definitions, stale dashboards, untracked schema changes, excess access to sensitive data, and surprise compute costs",
    },
    "HR & People": {
      evidence: "employee-data permissions, payroll or HRIS integration, regional requirements, manager workflows, reporting access, and employee self-service",
      checks: "role changes, onboarding and offboarding, approvals, data exports, audit history, regional settings, and access to sensitive employee records",
      risks: "incorrect employee records, excessive manager access, missed offboarding, unclear retention rules, and integrations that silently stop syncing",
    },
    "Finance & Accounting": {
      evidence: "approval controls, audit trails, reconciliation, accounting-system integration, regional requirements, data export, and total cost of ownership",
      checks: "a representative reconciliation, approval separation, tax or currency handling, close-period reporting, audit logs, exports, and recovery procedures",
      risks: "duplicate transactions, untraceable edits, weak approval separation, incorrect mappings, and selecting a plan that lacks a required control",
    },
    "Productivity": {
      evidence: "capture and retrieval, collaboration, permissions, search quality, portability, recurring workflows, and whether the tool reduces process overhead",
      checks: "finding a known item, sharing with the right audience, moving data out, recurring tasks, mobile or offline needs, and notification controls",
      risks: "information scattered across too many spaces, poor ownership, inaccessible records, and workflows that add more administration than they remove",
    },
    "Security & Compliance": {
      evidence: "threat coverage, identity and access controls, audit logs, incident response, deployment requirements, compliance evidence, and alert workload",
      checks: "a controlled test, role boundaries, log retention, alert triage, integration permissions, incident export, and the evidence behind compliance statements",
      risks: "alert fatigue, unreviewed exceptions, broad service-account access, missing audit records, and treating a vendor badge as proof of your own compliance",
    },
    "Communication": {
      evidence: "call or message quality, admin controls, guest access, retention, integrations, accessibility, and behavior across devices and network conditions",
      checks: "a typical meeting or support call, guest join flow, captions, recording permissions, retention, calendar integration, and low-bandwidth behavior",
      risks: "external guests unable to join, unclear recording consent, fragmented conversations, and retention settings that conflict with company policy",
    },
  }
  const profile = categoryProfiles[category] || {
    evidence: "workflow fit, integrations, permissions, reporting, data portability, support boundaries, and total cost at expected usage",
    checks: "a representative workflow, role permissions, export quality, integration failure handling, reporting, and current plan limits",
    risks: "unclear ownership, untested assumptions, avoidable manual work, weak access controls, and costs that rise as usage expands",
  }
  const topicProfiles: Array<[RegExp, string]> = [
    [/migration|migrate|transition/i, "Treat migration as a controlled data change: inventory source fields, map ownership and identifiers, clean duplicates, rehearse a small import, reconcile record counts, and keep a rollback copy until users validate the destination."],
    [/pricing|cost|budget|total-cost/i, "Build a cost model for the expected number of users and usage volume. Include required tiers, add-ons, implementation, migration, training, administration, overages, and the cost of leaving; label each assumption and confirm changing prices with the vendor."],
    [/security|risk|privacy|identity|password|endpoint|devsecops/i, "Start from the threat or control the team must address. Define what is in scope, who owns alerts and exceptions, what evidence is retained, and how the team will respond when a control fails; avoid treating a certification as a substitute for configuration review."],
    [/api|ci-cd|pipeline|infrastructure|monitoring|error-tracking|engineering/i, "Validate the complete operational path, including authentication, failure handling, retries, observability, rate limits, deployment or rollback, and the person responsible for keeping the integration healthy after the initial setup."],
    [/analytics|attribution|intelligence|data-governance|data-engineering|reporting/i, "Write down the source of truth for each important metric, its owner, update frequency, allowed filters, and known limitations. Reconcile a sample result to raw records before using a dashboard for decisions."],
    [/onboarding|recruiting|hr|payroll|employee/i, "Map the employee lifecycle and the permissions at each step. Test a joiner, a role change, and a leaver; check data minimization, approvals, regional rules, audit history, and the process for correcting a mistaken record."],
    [/project-management|task-management|agile|okr|collaboration|remote-work/i, "Model one real work cycle from intake through assignment, dependency changes, review, and completion. Confirm who updates status, which notifications are useful, how capacity is represented, and how reports avoid rewarding activity over outcomes."],
    [/ai-|ai_|artificial-intelligence|machine-learning/i, "Evaluate the system on representative inputs that include ordinary cases, edge cases, and cases where it should refuse or escalate. Record the expected output, error tolerance, review owner, data restrictions, and cost per useful result."],
    [/accessibility|design-system|ux-research|web-design|website-builder/i, "Test the full user journey rather than a single screenshot: keyboard operation, focus order, screen-reader labels where relevant, responsive layouts, collaboration handoff, export fidelity, and how defects are recorded and fixed."],
  ]
  const topicSpecific = topicProfiles.find(([pattern]) => pattern.test(slug + " " + topic))?.[1]
    || "Choose a representative end-to-end workflow and define the input, expected result, responsible owner, exception path, and evidence that would show the process is working. Keep this test small enough to repeat when requirements or product versions change."
  const criteria = [
    "Record the must-have outcome, the current workaround, and the baseline time or error rate before comparing options.",
    "Mark every requirement as verified, partially verified, unavailable, or not yet checked; do not treat missing evidence as a confirmed capability.",
    "Check role permissions, data export and deletion, integration failure behavior, accessibility needs, and the support path for incidents.",
    "Estimate full cost for the intended team and usage level, including setup, training, administration, and contract renewal.",
    "Define a pilot pass/fail threshold in advance and ask the people doing the work to validate it.",
  ]
  const rollout = [
    "Assign one owner for the workflow, one technical or administrative owner, and a named person who can approve changes.",
    "Use a limited pilot with representative data and a written rollback plan before moving business-critical work.",
    "Capture defects, workarounds, training questions, and unresolved vendor claims in one decision log.",
    "Review adoption and failure cases after launch; fix the process before expanding to more teams.",
  ]
  return [
    ...sections,
    {
      title: "Define the job this guide must solve",
      body: `Use this ${topic} guide to make a decision about a real workflow, not to collect a longer feature checklist. Describe who performs the work, what starts it, what result is required, which systems or people it depends on, and where the current process breaks down. Record a baseline—such as time per task, rework, missed handoffs, or reporting delay—so the team can compare the proposed change with the current process. Separate the outcome from the preferred tool: if a requirement cannot be tied to a user need, risk, or operating constraint, keep it as a preference rather than a purchase blocker.`,
      type: "text",
    },
    {
      title: "Category-specific evaluation criteria",
      body: `For ${category.toLowerCase()}, prioritize ${profile.evidence}. Ask each vendor or implementation owner to demonstrate the same requirements against your scenario. The most useful evidence is a current product document, a reproducible test, or a written answer that describes the relevant plan and limitation. Record the date and source for any time-sensitive claim. If an important capability is unclear, mark it as unverified and resolve it before making a commitment rather than assuming it is included.`,
      type: "text",
    },
    {
      title: "Practical validation for this topic",
      body: `${topicSpecific} For this ${topic.toLowerCase()} decision, also verify ${profile.checks}. Keep the test narrow enough that another person can repeat it, and preserve the input, expected result, observed result, and any workaround. A successful demo is not sufficient if it uses prepared data or avoids the exception paths the team encounters in normal work.`,
      type: "text",
    },
    {
      title: "Cost, ownership, and operational risk",
      body: `Compare the full operating cost, not only the headline subscription. Include configuration, migration, training, ongoing administration, required integrations, usage limits, and the effort needed to review or correct outputs. Name the person who will own updates, access reviews, incident handling, and renewal decisions. For ${category.toLowerCase()}, specifically watch for ${profile.risks}. Confirm how data can be exported or deleted and what happens if the product, integration, or vendor becomes unavailable.`,
      type: "text",
    },
    {
      title: "Pilot plan and acceptance checklist",
      body: "Before rollout, agree on a small test with a named owner, a time limit, representative users, realistic data, and an explicit pass/fail rule. Use the checklist below as evidence to collect, not as claims that a vendor has already passed.",
      type: "list",
      items: criteria,
    },
    {
      title: "Implementation and review checkpoints",
      body: `Use a staged rollout rather than switching every team at once. For ${topic.toLowerCase()}, the implementation checkpoints are:`,
      type: "list",
      items: rollout,
    },
    {
      title: "Decision record and next review",
      body: "Keep a concise decision record containing the requirements, evidence links, test results, unresolved risks, cost assumptions, selected option, and reason alternatives were rejected. After launch, compare actual use with the baseline and revisit the choice when workflows, team size, pricing, security requirements, or product limits change. If the pilot fails a must-have criterion, pause expansion and fix the gap or reassess the option instead of lowering the acceptance standard after the fact.",
      type: "text",
    },
  ]
}
function buildAlternativeSections(alt: AlternativeContent): ContentSection[] {
  const sections = sanitizeSections(alt.sections)
  if (sectionWordCount(sections) >= 900) return sections
  const alternatives = Array.isArray(alt.alternatives) ? alt.alternatives : []
  const criteria = Array.isArray(alt.selectionCriteria) ? alt.selectionCriteria : []
  const enriched = alternatives.slice(0, 8).map((item) => {
    const review = getReview(item.slug)
    if (!review) return item
    const capabilities = review.features.filter((f) => f.available).slice(0, 4).map((f) => f.name).join(", ")
    const fit = review.tagline || review.description
    return {
      ...item,
      description: sanitizeUnsupportedClaims(`${review.name} is a ${review.category.toLowerCase()} option. ${fit} Recorded strengths include ${capabilities || "the capabilities listed in its review"}.`),
    }
  })
  const shortlist = enriched.map((item) => `${item.name} (${item.rating}/5): ${sanitizeUnsupportedClaims(item.description)}`)
  return [
    ...sections,
    { title: `What to look for beyond ${alt.toolName}`, body: `A useful alternative solves the reason you are considering a change. For ${alt.toolName}, compare the shortlist against the workflow you need to replace, the integrations your team already depends on, administration effort, and total cost at your expected usage. The recorded ratings are comparison signals rather than universal rankings.`, type: "text" },
    { title: "Shortlist and fit", body: `The alternatives recorded on this page provide a practical starting point. Read each description next to its rating and then open the linked product review before making a final choice.`, type: "list", items: shortlist },
    { title: "Migration checks", body: `Before switching, document the data that must move, integrations that must remain operational, authentication and user-provisioning requirements, reporting continuity, and training effort. Run a representative proof-of-concept before a full migration when the data is business-critical.`, type: "text" },
    { title: "Decision checklist", body: "Use the recorded criteria as the common scorecard for the final options.", type: "list", items: criteria.slice(0, 8).length ? criteria.slice(0, 8) : ["Core workflow fit", "Pricing and total cost of ownership", "Integrations and data portability", "Administration and adoption", "Migration effort and support"] },
  ]
}
export function getAlternative(slug: string): AlternativeContent | null {
  const file = path.join(CONTENT_DIR, "alternatives", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const alt = readJson<AlternativeContent>(file)
  const alternatives = Array.isArray(alt.alternatives) ? alt.alternatives : []
  const cleaned = {
    ...alt,
    alternatives,
    selectionCriteria: Array.isArray(alt.selectionCriteria) ? alt.selectionCriteria : [],
    title: sanitizeAlternativeTitle(alt.title, alt.toolName, alternatives.length),
    description: sanitizeAlternativeDescription(alt.description, alt.toolName, alternatives.length),
    sections: buildAlternativeSections(alt),
    faqs: sanitizeFaqs(alt.faqs),
  }
  return cleaned
}

export function getAllAlternatives(): AlternativeContent[] {
  return readDir(path.join(CONTENT_DIR, "alternatives"))
    .map((f) => getAlternative(f.replace(/\.json$/, "")))
    .filter((x): x is AlternativeContent => Boolean(x))
}

export function getUseCase(slug: string): UseCaseContent | null {
  const file = path.join(CONTENT_DIR, "use-cases", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const useCase = readJson<UseCaseContent>(file)
  return {
    ...useCase,
    description: trimText(useCase.description, 700),
    useCaseDescription: trimText(useCase.useCaseDescription, 1200),
    recommendations: useCase.recommendations.slice(0, 12).map((x) => ({ ...x, bestFor: trimText(x.bestFor, 360), keyFeatures: sanitizeList(x.keyFeatures, 6) })),
    selectionCriteria: useCase.selectionCriteria.slice(0, 10).map((x) => ({ ...x, description: trimText(x.description, 360) })),
    commonPitfalls: sanitizeList(useCase.commonPitfalls, 8),
    faqs: sanitizeFaqs(useCase.faqs),
  }
}

export function getAllUseCases(): UseCaseContent[] {
  return readDir(path.join(CONTENT_DIR, "use-cases"))
    .map((f) => { const u = readJson<UseCaseContent>(path.join(CONTENT_DIR, "use-cases", f)); return { ...u, faqs: sanitizeFaqs(u.faqs) } })
}

export function getIndustry(slug: string): IndustryContent | null {
  const file = path.join(CONTENT_DIR, "industries", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const industry = readJson<IndustryContent>(file)
  return {
    ...industry,
    description: trimText(industry.description, 700),
    industryOverview: trimText(industry.industryOverview, 1600),
    softwareNeeds: sanitizeList(industry.softwareNeeds, 10),
    recommendations: industry.recommendations.slice(0, 12).map((x) => ({ ...x, bestFor: trimText(x.bestFor, 360) })),
    implementationTips: sanitizeList(industry.implementationTips, 10),
    faqs: sanitizeFaqs(industry.faqs),
  }
}

export function getAllIndustries(): IndustryContent[] {
  return readDir(path.join(CONTENT_DIR, "industries"))
    .map((f) => { const i = readJson<IndustryContent>(path.join(CONTENT_DIR, "industries", f)); return { ...i, faqs: sanitizeFaqs(i.faqs) } })
}

export function getResearch(slug: string): ResearchContent | null {
  const file = path.join(CONTENT_DIR, "research", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const research = readJson<ResearchContent>(file)
  return { ...research, sections: sanitizeSections(research.sections), faqs: sanitizeFaqs(research.faqs) }
}

export function getAllResearch(): ResearchContent[] {
  return readDir(path.join(CONTENT_DIR, "research"))
    .map((f) => { const r = readJson<ResearchContent>(path.join(CONTENT_DIR, "research", f)); return { ...r, sections: sanitizeSections(r.sections), faqs: sanitizeFaqs(r.faqs) } })
}

export function getStatistic(slug: string): StatisticContent | null {
  const file = path.join(CONTENT_DIR, "statistics", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<StatisticContent>(file)
}

export function getAllStatistics(): StatisticContent[] {
  return readDir(path.join(CONTENT_DIR, "statistics"))
    .map((f) => readJson<StatisticContent>(path.join(CONTENT_DIR, "statistics", f)))
}

export function getBest(slug: string): BestContent | null {
  const file = path.join(CONTENT_DIR, "best", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const best = readJson<BestContent>(file)
  return {
    ...best,
    description: trimText(best.description, 700),
    criteria: sanitizeList(best.criteria, 8),
    picks: best.picks.slice(0, 10).map((p) => {
      const review = getReview(p.toolSlug)
      return {
        ...p,
        bestFor: trimText(p.bestFor, 360),
        pros: sanitizeList(review?.pros?.length ? review.pros : p.pros, 5),
        cons: sanitizeList(review?.cons?.length ? review.cons : p.cons, 5),
      }
    }),
    pricingSummary: trimText(best.pricingSummary, 900),
    comparisonTable: { ...best.comparisonTable, columns: best.comparisonTable.columns.map((x) => trimText(x, 160)), rows: best.comparisonTable.rows.slice(0, 12).map((row) => row.map((x) => trimText(x, 360))) },
    faqs: sanitizeFaqs(best.faqs),
  }
}

export function getAllBest(): BestContent[] {
  return readDir(path.join(CONTENT_DIR, "best"))
    .map((f) => getBest(f.replace(/\.json$/, "")))
    .filter((x): x is BestContent => Boolean(x))
}

export function getHub(slug: string): HubContent | null {
  const file = path.join(CONTENT_DIR, "hubs", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const hub = readJson<HubContent>(file)
  hub.faqs = sanitizeFaqs(hub.faqs)
  return hub
}

export function getAllHubs(): HubContent[] {
  return readDir(path.join(CONTENT_DIR, "hubs"))
    .map((f) => { const h = readJson<HubContent>(path.join(CONTENT_DIR, "hubs", f)); h.faqs = sanitizeFaqs(h.faqs); return h })
}

export function getContentTitle(type: string, slug: string): string | null {
  switch (type) {
    case "review": return getReview(slug)?.name ?? null
    case "comparison": return getComparison(slug)?.title ?? null
    case "guide": return getGuide(slug)?.title ?? null
    case "blog": return getBlogPost(slug)?.title ?? null
    case "glossary": return getGlossaryTerm(slug)?.term ?? null
    case "alternative": return getAlternative(slug)?.title ?? null
    case "use-case": return getUseCase(slug)?.title ?? null
    case "industry": return getIndustry(slug)?.title ?? null
    case "research": return getResearch(slug)?.title ?? null
    case "statistic": return getStatistic(slug)?.title ?? null
    case "best": return getBest(slug)?.title ?? null
    case "hub": return getHub(slug)?.title ?? null
    default: return null
  }
}

export function searchContent(query: string): {
  reviews: ReviewContent[]
  comparisons: ComparisonContent[]
  guides: GuideContent[]
  glossary: GlossaryContent[]
  blog: BlogContent[]
} {
  const q = query.toLowerCase()
  const match = (text: string) => text.toLowerCase().includes(q)
  return {
    reviews: getAllReviews().filter((r) => match(r.name) || match(r.description)),
    comparisons: getAllComparisons().filter((c) => match(c.title) || match(c.description)),
    guides: getAllGuides().filter((g) => match(g.title) || match(g.description)),
    glossary: getAllGlossaryTerms().filter((t) => match(t.term) || match(t.definition)),
    blog: getAllBlogPosts().filter((b) => match(b.title) || match(b.description)),
  }
}

export {
  getClaims,
  getClaim,
  getSources,
  getSource,
  getCoverage,
} from "@/lib/content/provenance"
