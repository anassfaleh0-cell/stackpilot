import type { ReviewContent, ComparisonContent, ComparisonFeature, GuideContent, GlossaryContent, BlogContent, CategoryKnowledge, AlternativeContent, UseCaseContent, IndustryContent, ResearchContent, StatisticContent, BestContent, HubContent, FAQItem } from "@/types/content"
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
export function isContentAvailable(type: string, slug: string): boolean {
  const dir = DIR_FOR_TYPE[type]
  if (!dir || !slug) return false
  if (getContentTitle(type, slug) === null) return false
  if (!NOINDEX_ENFORCED.has(type)) return true
  return !isNoindexed(dir, slug)
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
]

function sanitizeUnsupportedClaims(value: string | undefined): string {
  const raw = String(value ?? "").trim()
  if (!raw) return ""
  return raw
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
  if (typeof value === "string") return value.length >= 40 ? sanitizeUnsupportedClaims(value) : value
  if (Array.isArray(value)) return value.map(sanitizeContentValue)
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {}
    for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
      out[key] = sanitizeContentValue(child)
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
  const derived: ComparisonFeature[] = [
    { name: "User Rating", tool1: Boolean(r1), tool2: Boolean(r2), tool1Detail: r1 ? `${r1.rating}/5 across ${r1.reviewCount.toLocaleString()} recorded reviews` : undefined, tool2Detail: r2 ? `${r2.rating}/5 across ${r2.reviewCount.toLocaleString()} recorded reviews` : undefined },
    { name: "Pricing", tool1: Boolean(r1), tool2: Boolean(r2), tool1Detail: r1 ? `${r1.pricing}${r1.priceRange ? `: ${r1.priceRange}` : ""}` : undefined, tool2Detail: r2 ? `${r2.pricing}${r2.priceRange ? `: ${r2.priceRange}` : ""}` : undefined },
    { name: "Category & Positioning", tool1: Boolean(r1), tool2: Boolean(r2), tool1Detail: r1 ? `${r1.category}. ${r1.tagline}` : cmp.category, tool2Detail: r2 ? `${r2.category}. ${r2.tagline}` : cmp.secondaryCategories?.[0] || cmp.category },
    { name: "Key Capabilities", tool1: Boolean(r1?.features?.length), tool2: Boolean(r2?.features?.length), tool1Detail: r1 ? r1.features.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(", ") : undefined, tool2Detail: r2 ? r2.features.filter((f) => f.available).slice(0, 5).map((f) => f.name).join(", ") : undefined },
    { name: "Integrations", tool1: Boolean(r1?.company?.integrations?.length), tool2: Boolean(r2?.company?.integrations?.length), tool1Detail: r1?.company?.integrations?.slice(0, 6).join(", "), tool2Detail: r2?.company?.integrations?.slice(0, 6).join(", ") },
    { name: "API", tool1: Boolean(r1?.company), tool2: Boolean(r2?.company), tool1Detail: r1?.company ? (r1.company.apiAvailable ? "API available in the recorded profile." : "API is not marked available in the recorded profile.") : undefined, tool2Detail: r2?.company ? (r2.company.apiAvailable ? "API available in the recorded profile." : "API is not marked available in the recorded profile.") : undefined },
    { name: "Security & Compliance", tool1: Boolean(r1?.company), tool2: Boolean(r2?.company), tool1Detail: r1?.company ? [...r1.company.securityCertifications, ...r1.company.compliance].slice(0, 8).join(", ") || "No specific certifications recorded." : undefined, tool2Detail: r2?.company ? [...r2.company.securityCertifications, ...r2.company.compliance].slice(0, 8).join(", ") || "No specific certifications recorded." : undefined },
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

  return [
    winnerLine,
    `This comparison covers ${features.length} recorded criteria. ${shared.length} criteria are marked as available for both products, ${exclusive1.length} are exclusive to ${tool1}, and ${exclusive2.length} are exclusive to ${tool2}. The most useful way to read the table is to focus on the criteria that map directly to the workflow you are replacing or improving.`,
    lead1 + (featureEvidence1 ? ` In the recorded detail, ${featureEvidence1}` : "") + " " + lead2 + (featureEvidence2 ? ` In the recorded detail, ${featureEvidence2}` : ""),
    pricingContext,
    `For the final choice, separate must-have requirements from preferences. A product with more recorded criteria is not automatically the better fit if the additional capabilities are irrelevant to your team. Likewise, a smaller feature footprint can be an advantage when it reduces configuration or training effort.`,
    switching,
  ].filter(Boolean).join("\n\n")
}
function sanitizeComparisonDescription(description: string, tool1: string, tool2: string, features: ComparisonFeature[], winner: string | null): string {
  const cleaned = sanitizeUnsupportedClaims(description).replace(/\s+/g, " ").trim()
  if (cleaned.length >= 80 && !/are paramount|including advanced\s*,|verify and compliance|our expert|we (?:evaluated|tested|researched) hundreds/i.test(cleaned)) return trimText(cleaned, 700)
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
    .map((f) => { const c = readJson<ComparisonContent>(path.join(CONTENT_DIR, "comparisons", f)); c.faqs = sanitizeFaqs(c.faqs); return c })
}

export function getGuide(slug: string): GuideContent | null {
  const file = path.join(CONTENT_DIR, "guides", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const guide = readJson<GuideContent>(file)
  return { ...guide, sections: sanitizeSections(guide.sections), faqs: sanitizeFaqs(guide.faqs) }
}

export function getAllGuides(): GuideContent[] {
  return readDir(path.join(CONTENT_DIR, "guides"))
    .map((f) => { const g = readJson<GuideContent>(path.join(CONTENT_DIR, "guides", f)); return { ...g, sections: sanitizeSections(g.sections), faqs: sanitizeFaqs(g.faqs) } })
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

export function getAlternative(slug: string): AlternativeContent | null {
  const file = path.join(CONTENT_DIR, "alternatives", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const alt = readJson<AlternativeContent>(file)
  return { ...alt, sections: sanitizeSections(alt.sections), faqs: sanitizeFaqs(alt.faqs) }
}

export function getAllAlternatives(): AlternativeContent[] {
  return readDir(path.join(CONTENT_DIR, "alternatives"))
    .map((f) => { const a = readJson<AlternativeContent>(path.join(CONTENT_DIR, "alternatives", f)); return { ...a, sections: sanitizeSections(a.sections), faqs: sanitizeFaqs(a.faqs) } })
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
    picks: best.picks.slice(0, 10).map((p) => ({ ...p, bestFor: trimText(p.bestFor, 360), pros: sanitizeList(p.pros, 5), cons: sanitizeList(p.cons, 5) })),
    pricingSummary: trimText(best.pricingSummary, 900),
    comparisonTable: { ...best.comparisonTable, columns: best.comparisonTable.columns.map((x) => trimText(x, 160)), rows: best.comparisonTable.rows.slice(0, 12).map((row) => row.map((x) => trimText(x, 360))) },
    faqs: sanitizeFaqs(best.faqs),
  }
}

export function getAllBest(): BestContent[] {
  return readDir(path.join(CONTENT_DIR, "best"))
    .map((f) => readJson<BestContent>(path.join(CONTENT_DIR, "best", f)))
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
