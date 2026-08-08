// Sprint 21 — Flagship data computation: SaaS Pricing Benchmark 2026
// Computes benchmark statistics from content/reviews/*.json (source of truth).
// Usage: node scripts/compute-pricing-benchmark.js
const fs = require("fs")
const path = require("path")

const REVIEWS_DIR = path.resolve(process.cwd(), "content", "reviews")

function parseRange(s) {
  if (!s) return null
  const lower = s.toLowerCase()
  if (lower.includes("custom") || lower.includes("varies") || lower.includes("contact")) return { custom: true }
  const nums = (s.match(/[\d]+(?:[.,]\d+)?/g) || []).map((n) => parseFloat(n.replace(",", "")))
  if (nums.length === 0) return { unparseable: true }
  const free = /free/i.test(s)
  const oneTime = /one-time|one time|lifetime/i.test(lower)
  const perUser = /per user|user\/mo|\/user/i.test(lower)
  return { min: Math.min(...nums), max: Math.max(...nums), free, oneTime, perUser }
}

function median(arr) {
  if (!arr.length) return null
  const m = Math.floor(arr.length / 2)
  return arr.length % 2 ? arr[m] : (arr[m - 1] + arr[m]) / 2
}

const files = fs.readdirSync(REVIEWS_DIR).filter((f) => f.endsWith(".json"))
const reviews = files.map((f) => JSON.parse(fs.readFileSync(path.join(REVIEWS_DIR, f), "utf8")))

const stats = reviews.map((r) => ({
  name: r.name || r.slug,
  category: r.category,
  pricing: r.pricing,
  rating: typeof r.rating === "number" ? r.rating : null,
  parsed: parseRange(r.priceRange),
}))

const parseable = stats.filter((s) => s.parsed && !s.parsed.custom && !s.parsed.unparseable)
const custom = stats.filter((s) => s.parsed && s.parsed.custom)
const monthly = parseable.filter((s) => !s.parsed.oneTime)
const starts = monthly.map((s) => s.parsed.min).sort((a, b) => a - b)
const ratings = stats.map((s) => s.rating).filter((r) => r !== null)

const pct = (n, total) => Math.round((100 * n) / total)

const pricingModels = {}
stats.forEach((s) => { pricingModels[s.pricing] = (pricingModels[s.pricing] || 0) + 1 })

const cats = {}
stats.forEach((s) => { (cats[s.category] = cats[s.category] || []).push(s) })

const categoryRows = Object.entries(cats)
  .map(([cat, arr]) => {
    const m = arr.filter((s) => s.parsed && !s.parsed.custom && !s.parsed.oneTime).map((s) => s.parsed.min).sort((a, b) => a - b)
    const freeT = arr.filter((s) => s.parsed && s.parsed.free).length
    return {
      category: cat,
      count: arr.length,
      medianStart: median(m),
      freeTierShare: pct(freeT, arr.length),
      paidCount: arr.filter((s) => s.pricing === "Paid").length,
      parsedCount: m.length,
    }
  })
  .sort((a, b) => b.count - a.count)

const output = {
  generatedAt: new Date().toISOString().slice(0, 10),
  corpusSize: stats.length,
  parseableShare: pct(parseable.length, stats.length),
  customPricingCount: custom.length,
  medianStartingPrice: median(starts),
  p25StartingPrice: starts.length ? starts[Math.floor(starts.length * 0.25)] : null,
  p75StartingPrice: starts.length ? starts[Math.floor(starts.length * 0.75)] : null,
  freeTierShare: pct(parseable.filter((s) => s.parsed.free).length, parseable.length),
  perUserShare: pct(monthly.filter((s) => s.parsed.perUser).length, monthly.length),
  avgRating: ratings.length ? Math.round((10 * ratings.reduce((a, b) => a + b, 0)) / ratings.length) / 10 : null,
  pricingModels: Object.entries(pricingModels)
    .map(([model, count]) => ({ model, count, share: pct(count, stats.length) }))
    .sort((a, b) => b.count - a.count),
  categories: categoryRows,
}

fs.writeFileSync(path.resolve(process.cwd(), "growth", "21-pricing-benchmark-data.json"), JSON.stringify(output, null, 2))
console.log("Computed " + stats.length + " reviews -> growth/21-pricing-benchmark-data.json")
console.log("Median starting price: $" + output.medianStartingPrice)
console.log("Free tier share: " + output.freeTierShare + "%")
