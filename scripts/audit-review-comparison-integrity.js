const fs = require("node:fs")
const path = require("node:path")

const ROOT = path.join(__dirname, "..", "content")
const REVIEWS_DIR = path.join(ROOT, "reviews")
const COMPARISONS_DIR = path.join(ROOT, "comparisons")

function readRecords(dir) {
  return fs.readdirSync(dir).filter((file) => file.endsWith(".json")).sort().map((file) => {
    const fullPath = path.join(dir, file)
    return { file, fullPath, data: JSON.parse(fs.readFileSync(fullPath, "utf8")) }
  })
}

function nonEmpty(value) {
  return typeof value === "string" && value.trim().length > 0
}

function validRating(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 5
}

const reviews = readRecords(REVIEWS_DIR)
const comparisons = readRecords(COMPARISONS_DIR)
const reviewBySlug = new Map(reviews.map(({ data }) => [data.slug, data]))
const findings = []
const summary = {
  reviews: { total: reviews.length, missingClaim: 0, missingRating: 0, invalidRating: 0, unverifiedStoredRating: 0, missingProsOrCons: 0, unverifiedPriceClaims: 0, unsupportedMetricClaims: 0, scoreCopyContradictions: 0, emptyContentSections: 0 },
  comparisons: { total: comparisons.length, missingDescription: 0, riskySnippetClaims: 0, missingVerdict: 0, missingFeatureRows: 0, missingToolLinks: 0, invalidWinner: 0, missingWinner: 0, useCaseFallback: 0, winnerNeedsEvidence: 0, linkedReviewRatingGaps: 0, unverifiedFeatureScore: 0, copyQualityFlags: 0 },
}

function add(type, slug, issue, detail = "") {
  findings.push({ type, slug, issue, detail })
}

for (const { file, data } of reviews) {
  const slug = data.slug || file.replace(/\.json$/, "")
  if (!nonEmpty(data.tagline) || !nonEmpty(data.description)) {
    summary.reviews.missingClaim++
    add("review", slug, "missing-claim", "tagline and description should state a useful, supportable review claim")
  }
  if (data.rating == null || data.rating === "") {
    summary.reviews.missingRating++
    add("review", slug, "missing-rating", "no numeric rating is recorded; do not invent one")
  } else if (!validRating(data.rating)) {
    summary.reviews.invalidRating++
    add("review", slug, "invalid-rating", String(data.rating))
  } else if (data.ratingVerified !== true) {
    summary.reviews.unverifiedStoredRating++
    add("review", slug, "rating-evidence-pending", String(data.rating))
  }
  if (!Array.isArray(data.pros) || data.pros.length === 0 || !Array.isArray(data.cons) || data.cons.length === 0) {
    summary.reviews.missingProsOrCons++
    add("review", slug, "pros-cons-incomplete", "preserve existing text and add specific, supportable trade-offs")
  }

  // Source-content diagnostics are report-only: they flag review copy for editorial
  // verification without deleting sections, changing ratings, or suppressing useful detail.
  const sections = Array.isArray(data.content) ? data.content : []
  const sectionTexts = sections.map((section) => ({
    title: String(section.title || ""),
    text: [section.body, ...(Array.isArray(section.items) ? section.items : [])]
      .filter((value) => typeof value === "string")
      .join(" "),
  }))
  const allReviewCopy = [
    data.description,
    data.tagline,
    ...sectionTexts.map((section) => section.text),
    ...(Array.isArray(data.faqs) ? data.faqs.flatMap((faq) => [faq.question, faq.answer]) : []),
  ].filter((value) => typeof value === "string").join(" ")

  if (validRating(data.rating) && data.ratingVerified !== true &&
      /(?:does not|doesn't|do not|don't) publish (?:a )?(?:numeric )?(?:score|rating)|no numeric (?:score|rating) (?:is )?published/i.test(allReviewCopy)) {
    summary.reviews.scoreCopyContradictions++
    add("review", slug, "score-copy-contradiction", "a stored editorial score exists but the copy says no numeric score is published; explain the score's provisional provenance instead")
  }

  const numericMetrics = /\b\d[\d,]*(?:\.\d+)?\s*(?:reviews|users|customers|employees|integrations|templates)\b/i
  const metricFlags = sectionTexts.filter((section) => numericMetrics.test(section.text))
  numericMetrics.lastIndex = 0
  if (metricFlags.length && data.reviewCountVerified !== true && data.ratingVerified !== true) {
    summary.reviews.unsupportedMetricClaims += metricFlags.length
    for (const section of metricFlags.slice(0, 3)) {
      add("review", slug, "numeric-metric-needs-source", `section "${section.title}" contains a numeric review/customer/product metric that should have a dated source or a clear caveat`)
    }
  }

  const priceAmount = /[$€£]\s?\d[\d,]*(?:\.\d+)?|\b(?:USD|EUR|GBP)\s?\d[\d,]*(?:\.\d+)?|\b\d[\d,]*(?:\.\d+)?\s?(?:USD|EUR|GBP)\b/i
  const priceContext = /\b(?:price|pricing|costs?|plan|tier|subscription|billing|from|per (?:user|seat|editor)|starts? at|starting at|monthly|annually|annual|renewal|fee|licen[cs]e|pay(?:s|ment)?|budget)\b|\/(?:user\/)?month\b|\/year\b|\/seat\b/i
  const unverifiedPriceSections = sectionTexts.filter((section) => priceAmount.test(section.text) && priceContext.test(section.text))
  if (unverifiedPriceSections.length && data.priceRangeVerified !== true) {
    summary.reviews.unverifiedPriceClaims += unverifiedPriceSections.length
    for (const section of unverifiedPriceSections.slice(0, 3)) {
      add("review", slug, "price-claim-needs-source", `section "${section.title}" contains a price-bearing claim but the review does not mark pricing as independently verified`)
    }
  }

  for (const section of sections) {
    const hasBody = typeof section.body === "string" && section.body.trim().length > 0
    const hasItems = Array.isArray(section.items) && section.items.some((item) => typeof item === "string" && item.trim().length > 0)
    if (nonEmpty(section.title) && !hasBody && !hasItems) {
      summary.reviews.emptyContentSections++
      add("review", slug, "empty-content-section", `section "${section.title}" has no visible body or list items`)
    }
  }
}

for (const { file, data } of comparisons) {
  const slug = data.slug || file.replace(/\.json$/, "")
  const tool1 = nonEmpty(data.tool1Slug) ? reviewBySlug.get(data.tool1Slug) : null
  const tool2 = nonEmpty(data.tool2Slug) ? reviewBySlug.get(data.tool2Slug) : null
  if (!nonEmpty(data.description)) {
    summary.comparisons.missingDescription++
    add("comparison", slug, "missing-description")
  }
  // Report risky search-snippet claims without mutating stored scores or winners.
  const snippet = String(data.description || "")
  const hasUnverifiedRatingClaim = /\b\d(?:\.\d)?\s*\/\s*5\b/i.test(snippet) &&
    ((tool1 && tool1.ratingVerified !== true) || (tool2 && tool2.ratingVerified !== true))
  const hasUnverifiedOverallPick = /\b(overall pick|best overall|clear winner)\b/i.test(snippet) &&
    data.winnerVerified !== true
  const hasIncompletePriceFragment = /\b(?:from|starting at)\s*(?:[.;,]|$)/i.test(snippet)
  if (hasUnverifiedRatingClaim || hasUnverifiedOverallPick || hasIncompletePriceFragment) {
    summary.comparisons.riskySnippetClaims++
    add("comparison", slug, "snippet-claim-needs-audit", [
      hasUnverifiedRatingClaim ? "numerical rating without verified linked review scores" : "",
      hasUnverifiedOverallPick ? "overall-pick language without verified winner evidence" : "",
      hasIncompletePriceFragment ? "incomplete pricing fragment" : "",
    ].filter(Boolean).join("; "))
  }
  if (!nonEmpty(data.verdict)) {
    summary.comparisons.missingVerdict++
    add("comparison", slug, "missing-verdict", "verdict can be use-case dependent; it must not be left blank")
  }
  if (!Array.isArray(data.features) || data.features.length === 0) {
    summary.comparisons.missingFeatureRows++
    add("comparison", slug, "missing-feature-rows")
  }
  if (!tool1 || !tool2) {
    summary.comparisons.missingToolLinks++
    add("comparison", slug, "linked-review-missing", [!tool1 ? data.tool1Slug || "tool1Slug missing" : "", !tool2 ? data.tool2Slug || "tool2Slug missing" : ""].filter(Boolean).join(", "))
  }
  if (!nonEmpty(data.winner)) {
    if (nonEmpty(data.verdict)) {
      summary.comparisons.useCaseFallback++
      add("comparison", slug, "winner-use-case-fallback", "no stored product pick; the page must surface the existing use-case-dependent verdict")
    } else {
      summary.comparisons.missingWinner++
      add("comparison", slug, "missing-winner", "record a provisional product pick or an explicit use-case-dependent verdict")
    }
  } else {
    const normalizedWinner = String(data.winner).trim().toLowerCase()
    const noUniversalWinner = new Set(["depends on use case", "use-case dependent", "no universal winner", "no single winner", "none", "n/a", "not applicable"])
    if (!noUniversalWinner.has(normalizedWinner)) {
      const matchesTool1 = [data.tool1, data.tool1Slug].some((value) => nonEmpty(value) && value.toLowerCase() === normalizedWinner)
      const matchesTool2 = [data.tool2, data.tool2Slug].some((value) => nonEmpty(value) && value.toLowerCase() === normalizedWinner)
      if (!matchesTool1 && !matchesTool2) {
        summary.comparisons.invalidWinner++
        add("comparison", slug, "winner-does-not-match-compared-tools", String(data.winner))
      } else if (data.winnerVerified !== true) {
        summary.comparisons.winnerNeedsEvidence++
        add("comparison", slug, "winner-evidence-pending", String(data.winner))
      }
    }
  }
  if (tool1 && (!validRating(tool1.rating) || tool1.ratingVerified !== true) || tool2 && (!validRating(tool2.rating) || tool2.ratingVerified !== true)) {
    summary.comparisons.linkedReviewRatingGaps++
    add("comparison", slug, "linked-rating-needs-audit", "one or both linked review ratings are missing or not marked verified")
  }
  if (data.featuresVerified !== true) {
    summary.comparisons.unverifiedFeatureScore++
    add("comparison", slug, "feature-score-not-verified", "UI must label coverage as unavailable/provisional, never as product quality")
  }

  // Editorial diagnostics only: never rewrite, hide, or delete source content.
  const copyFields = [
    data.description,
    data.verdict,
    ...(Array.isArray(data.faqs) ? data.faqs.flatMap((faq) => [faq.question, faq.answer]) : []),
  ].filter((value) => typeof value === "string" && value.trim())
  const suspiciousCopyPatterns = [
    { issue: "broken-sentence-fragment", pattern: /\b(?:our|the)\s+provides?\s+(?:detailed|a|an|comprehensive)\b/i, detail: "check for a missing subject or link label in this sentence" },
    { issue: "missing-template-placeholder", pattern: /,\s*(?:are paramount|including advanced\s*,|and options are critical requirements|verify\s+and compliance|without considering\s*-|ignoring\s+and support quality)\b/i, detail: "a generated internal-link label may be empty; supply readable fallback text instead of leaving a sentence gap" },
    { issue: "unsupported-precise-discount", pattern: /\b(?:saves?|discount(?:s|ed)?)\s+(?:up to )?\d{1,2}\s*%|\b\d{1,2}\s*%\s+(?:discount|cheaper|less)\b/i, detail: "verify the exact percentage and its scope against a current vendor source" },
    { issue: "unsupported-exact-timeline", pattern: /\b(?:within|in|takes?)\s+\d+\s*(?:-|–|to)\s*\d+\s*(?:days?|weeks?|months?)\b/i, detail: "treat exact implementation/migration timelines as estimates unless supported by evidence" },
  ]
  for (const copy of copyFields) {
    for (const rule of suspiciousCopyPatterns) {
      if (rule.pattern.test(copy)) {
        summary.comparisons.copyQualityFlags++
        add("comparison", slug, rule.issue, rule.detail)
      }
    }
  }
}

const missingWinnerRecords = findings.filter((item) => item.issue === "missing-winner")
console.log(`Comparisons missing a stored winner (${missingWinnerRecords.length}):`)
for (const item of missingWinnerRecords) console.log(item.slug)
console.log("PilotStack review/comparison integrity audit (report-only; no source data changed)")
console.log(JSON.stringify(summary, null, 2))
console.log("\nFindings (first 300):")
for (const item of findings.slice(0, 300)) {
  console.log([item.type, item.slug, item.issue, item.detail].filter(Boolean).join(" | "))
}
if (findings.length > 300) console.log(`... ${findings.length - 300} additional findings omitted from console output`)
console.log(`\nTotal findings: ${findings.length}`)
const structuralIssues = new Set([
  "missing-claim",
  "missing-rating",
  "invalid-rating",
  "pros-cons-incomplete",
  "missing-description",
  "missing-verdict",
  "missing-feature-rows",
  "linked-review-missing",
  "missing-winner",
  "winner-does-not-match-compared-tools",
])
const criticalFindings = findings.filter((item) => structuralIssues.has(item.issue))
console.log(`Structural integrity findings (${criticalFindings.length}):`)
for (const item of criticalFindings) {
  console.log([item.type, item.slug, item.issue, item.detail].filter(Boolean).join(" | "))
}
console.log("This report intentionally does not delete pages or replace missing values with invented scores.")
console.log("Evidence-pending scores and picks remain visible as provisional; --strict enforces required fields and valid winner labels.")
if (process.argv.includes("--strict") && criticalFindings.length > 0) {
  process.exitCode = 1
}
