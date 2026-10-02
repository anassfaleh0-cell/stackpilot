import { truncateAtWordBoundary } from "@/lib/metadata"

const SCORE_DECIMALS = 1

export function formatScore(value: unknown, decimals: number = SCORE_DECIMALS): string {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n)) return "—"
  return n.toFixed(decimals)
}

export function scorePercent(value: unknown, max = 5): string {
  const n = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(n) || max <= 0) return "0"
  const pct = (n / max) * 100
  return String(Math.max(0, Math.min(100, Math.round(pct))))
}

export function scoreWidth(value: unknown, max = 5): string {
  return `${scorePercent(value, max)}%`
}

const VOWEL = /^[aeiou]/i

const A_BEFORE = [
  "okta", "one", "once", "ouija", "euro", "eur", "eul", "eup", "euc", "euk",
  "ubi", "uni", "unit", "univ", "usu", "use", "user", "usag", "honest", "hour",
  "honou", "heir",
]

export function articleFor(word: string): "A" | "An" {
  const w = word.trim()
  if (!VOWEL.test(w)) return "A"
  const lower = w.toLowerCase()
  return A_BEFORE.some((p) => lower.startsWith(p)) ? "A" : "An"
}

export function withArticle(word: string): string {
  return `${articleFor(word)} ${word}`
}

const RATING_RESTATEMENT = /^Rated\s+\d+(?:\.\d+)?\s+out of\s+\d+\s+from\s+[\d,]+\s+reviews\b/i

export function isRatingRestatement(pro: string): boolean {
  return RATING_RESTATEMENT.test(pro.trim())
}

export function editorialPros(pros: string[]): string[] {
  return pros.filter((pro) => !isRatingRestatement(pro))
}

const META_DESCRIPTION_MAX = 160
const META_TITLE_YEAR = "2026"

export function reviewMetaTitle(name: string): string {
  return `${name} Review (${META_TITLE_YEAR}): Pricing, Pros and Cons`
}

export function reviewMetaDescription(name: string, tagline: string, category: string): string {
  const core = `${withArticle(name)} review: ${String(tagline).trim()}`
  if (core.length >= 90) return truncateAtWordBoundary(core, META_DESCRIPTION_MAX)
  const tail = ` Pricing, pros, cons, and where ${name} sits among ${category.toLowerCase()} tools.`
  return truncateAtWordBoundary(`${core}${tail}`, META_DESCRIPTION_MAX)
}
