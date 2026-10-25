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
  reviews: { total: reviews.length, missingClaim: 0, missingRating: 0, invalidRating: 0, unverifiedStoredRating: 0, missingProsOrCons: 0 },
  comparisons: { total: comparisons.length, missingDescription: 0, missingVerdict: 0, missingFeatureRows: 0, missingToolLinks: 0, invalidWinner: 0, missingWinner: 0, winnerNeedsEvidence: 0, linkedReviewRatingGaps: 0, unverifiedFeatureScore: 0 },
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
}

for (const { file, data } of comparisons) {
  const slug = data.slug || file.replace(/\.json$/, "")
  const tool1 = nonEmpty(data.tool1Slug) ? reviewBySlug.get(data.tool1Slug) : null
  const tool2 = nonEmpty(data.tool2Slug) ? reviewBySlug.get(data.tool2Slug) : null
  if (!nonEmpty(data.description)) {
    summary.comparisons.missingDescription++
    add("comparison", slug, "missing-description")
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
    summary.comparisons.missingWinner++
    add("comparison", slug, "missing-winner", "record a provisional product pick or an explicit use-case-dependent verdict")
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
