import type { ReviewContent, ComparisonContent, GuideContent, GlossaryContent, BlogContent, CategoryKnowledge, AlternativeContent, UseCaseContent, IndustryContent, ResearchContent, StatisticContent, BestContent, HubContent, FAQItem } from "@/types/content"
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
const NOINDEX_ENFORCED = new Set(["review", "comparison", "guide", "best", "alternative", "glossary", "statistic"])

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
]

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
    const question = String(faq?.question ?? "").trim()
    const answer = String(faq?.answer ?? "").trim()
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
  const data = JSON.parse(raw) as Record<string, unknown>
  for (const key of Object.keys(data)) {
    if (DATE_FIELDS.has(key) && typeof data[key] === "string") {
      data[key] = toISODate(data[key])
    }
  }
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

export function getComparison(slug: string): ComparisonContent | null {
  const file = path.join(CONTENT_DIR, "comparisons", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  const cmp = readJson<ComparisonContent>(file)
  if (cmp.published === false) return null
  return {
    ...cmp,
    description: trimText(cmp.description, 700),
    verdict: trimText(cmp.verdict, 1600),
    features: cmp.features.slice(0, 20).map((f) => ({ ...f, name: trimText(f.name, 140), tool1Detail: trimText(f.tool1Detail, 320), tool2Detail: trimText(f.tool2Detail, 320) })),
    faqs: sanitizeFaqs(cmp.faqs),
  }
}

export function getAllComparisons(): ComparisonContent[] {
  return readDir(path.join(CONTENT_DIR, "comparisons"))
    .map((f) => { const c = readJson<ComparisonContent>(path.join(CONTENT_DIR, "comparisons", f)); c.faqs = sanitizeFaqs(c.faqs); return c })
    .filter((c) => c.published !== false)
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

export function getBlogPost(slug: string): BlogContent | null {
  const file = path.join(CONTENT_DIR, "blog", `${slug}.json`)
  if (!fs.existsSync(file)) return null
  return readJson<BlogContent>(file)
}

export function getAllBlogPosts(): BlogContent[] {
  return readDir(path.join(CONTENT_DIR, "blog"))
    .map((f) => readJson<BlogContent>(path.join(CONTENT_DIR, "blog", f)))
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
  if (alt.published === false) return null
  return { ...alt, sections: sanitizeSections(alt.sections), faqs: sanitizeFaqs(alt.faqs) }
}

export function getAllAlternatives(): AlternativeContent[] {
  return readDir(path.join(CONTENT_DIR, "alternatives"))
    .map((f) => { const a = readJson<AlternativeContent>(path.join(CONTENT_DIR, "alternatives", f)); return { ...a, sections: sanitizeSections(a.sections), faqs: sanitizeFaqs(a.faqs) } })
    .filter((a) => a.published !== false)
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
  if (best.published === false) return null
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
    .filter((b) => b.published !== false)
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
