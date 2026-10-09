const fs = require("node:fs")
const path = require("node:path")

const ROOT = path.join(__dirname, "..")
const DIRS = [
  "guides", "comparisons", "reviews", "best", "blog", "glossary",
  "alternatives", "use-cases", "industries", "research", "statistics", "hubs",
]
const THRESHOLDS = {
  guides: 450, comparisons: 500, reviews: 500, best: 350, blog: 450,
  glossary: 80, alternatives: 250, "use-cases": 250, industries: 250,
  research: 350, statistics: 100, hubs: 250,
}
const TEMPLATE_PATTERNS = [
  /this section covers .* based on our research and structured product review/gi,
  /choosing the right .* software starts with understanding your specific requirements/gi,
  /focus on these criteria: feature completeness relative to your needs/gi,
  /most successful deployments follow a phased approach rather than a big-bang rollout/gi,
  /most teams see positive roi within 3-6 months/gi,
  /the most common mistakes teams make with .* include underinvesting in the initial setup/gi,
  /is positioned to benefit from trends like ai-powered automation, deeper integration ecosystems/gi,
  /comprehensive guide to choosing .* expert analysis, comparison criteria, and buying advice/gi,
]
function collect(value) {
  if (typeof value === "string") return [value]
  if (Array.isArray(value)) return value.flatMap(collect)
  if (value && typeof value === "object") return Object.values(value).flatMap(collect)
  return []
}
function wordCount(data) {
  return collect(data).join(" ").trim().split(/\s+/).filter(Boolean).length
}
function filesIn(dir) {
  const abs = path.join(ROOT, "content", dir)
  if (!fs.existsSync(abs)) return []
  return fs.readdirSync(abs).filter((f) => f.endsWith(".json")).map((file) => {
    const full = path.join(abs, file)
    const raw = fs.readFileSync(full, "utf8")
    return { dir, file, full, raw, data: JSON.parse(raw) }
  })
}
const corpus = DIRS.flatMap(filesIn)
const thin = []
const template = []
const emptyGuideRelations = []
const stale = []
const unsourcedReviewCounts = []
const malformed = []
const byDir = {}
for (const item of corpus) {
  byDir[item.dir] = (byDir[item.dir] || 0) + 1
  const words = wordCount(item.data)
  if (words < (THRESHOLDS[item.dir] || 250)) thin.push({ path: item.full.replace(ROOT + path.sep, ""), words, dir: item.dir })
  if (item.dir === "guides" && (!Array.isArray(item.data.relatedTools) || item.data.relatedTools.length === 0) &&
      (!Array.isArray(item.data.relatedGuides) || item.data.relatedGuides.length === 0)) {
    emptyGuideRelations.push(item.full.replace(ROOT + path.sep, ""))
  }
  if (item.dir === "reviews" && Number.isFinite(item.data.reviewCount) && item.data.reviewCount > 0 &&
      !item.data.reviewCountSource && !item.data.reviewCountSourceUrl) {
    unsourcedReviewCounts.push(item.full.replace(ROOT + path.sep, ""))
  }
  const date = item.data.lastUpdated || item.data.contentModified || item.data.publishedAt || item.data.updatedAt
  if (date) {
    const parsed = new Date(date)
    if (Number.isNaN(parsed.getTime())) malformed.push({ path: item.full.replace(ROOT + path.sep, ""), date })
    else if (parsed.getTime() > Date.now() + 86400000 || Date.now() - parsed.getTime() > 365 * 86400000) {
      stale.push({ path: item.full.replace(ROOT + path.sep, ""), date })
    }
  }
  const text = item.raw
  const hits = TEMPLATE_PATTERNS.flatMap((pattern) => {
    pattern.lastIndex = 0
    return (text.match(pattern) || []).map((match) => match.slice(0, 140))
  })
  if (hits.length) template.push({ path: item.full.replace(ROOT + path.sep, ""), hits: hits.slice(0, 3) })
}
const samples = (items, n = 12) => items.slice(0, n)
console.log("[editorial-content-audit] REPORT ONLY — no files modified")
console.log("Corpus files:", corpus.length)
console.log("Files by type:", JSON.stringify(byDir))
console.log("Below heuristic word-count threshold:", thin.length, "sample:", JSON.stringify(samples(thin)))
console.log("Template-pattern matches:", template.length, "sample:", JSON.stringify(samples(template)))
console.log("Guides without related tools/guides:", emptyGuideRelations.length, "sample:", JSON.stringify(samples(emptyGuideRelations)))
console.log("Review counts without a source field:", unsourcedReviewCounts.length, "sample:", JSON.stringify(samples(unsourcedReviewCounts)))
console.log("Stale/future/malformed content dates:", stale.length + malformed.length, "sample:", JSON.stringify(samples([...stale, ...malformed])))
