#!/usr/bin/env node
/**
 * Read-only editorial audit for the entire committed PilotStack content corpus.
 *
 * This tool reports source records that need a human/product-evidence review.
 * It does not delete, noindex, rewrite, or artificially lengthen pages.
 *
 * Usage:
 *   node scripts/audit-content-quality.cjs
 *   node scripts/audit-content-quality.cjs --json /tmp/content-quality-report.json
 */
const fs = require("node:fs")
const path = require("node:path")

const root = path.resolve(__dirname, "..", "content")
const folders = [
  "reviews", "comparisons", "guides", "best", "use-cases",
  "industries", "alternatives", "blog", "research", "statistics",
  "glossary", "hubs",
]
const priority = { broken_json: 1, malformed_html: 1, empty_comparison: 1,
  cross_category_comparison: 2, generic_audience: 2, fabricated_scale_claim: 1,
  thin_source: 2, missing_verdict: 2, score_provenance: 3,
  bulk_generated_body: 2, missing_source_links: 3 }

const records = new Map()
const findings = []
const counts = {}
function flag(type, section, slug, note) {
  findings.push({ severity: priority[type] ?? 3, type, section, slug, note })
}
function words(value) {
  return String(value || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length
}
for (const folder of folders) {
  const dir = path.join(root, folder)
  let files = []
  try { files = fs.readdirSync(dir).filter((p) => p.endsWith(".json")).sort() }
  catch { continue }
  counts[folder] = files.length
  for (const file of files) {
    const slug = file.replace(/\.json$/, "")
    let data
    try { data = JSON.parse(fs.readFileSync(path.join(dir, file), "utf8")) }
    catch (err) {
      flag("broken_json", folder, slug, err.message)
      continue
    }
    records.set(folder + "/" + slug, data)
  }
}

const get = (folder, slug) => records.get(folder + "/" + slug)
const unsupportedAudience = /\b(?:5[–-]200 users|more than 500 users|large enterprises with complex compliance requirements)\b/i
const fakeScale = /\b(?:we tested (?:hundreds|thousands)|our team independently benchmarked|solutions evaluated:\s*\d+\+)\b/i
for (const [id, data] of records) {
  const [section, slug] = id.split("/")
  const body = String(data.body || "")
  const text = [data.description, data.whoShouldUse, data.whoShouldNotUse,
    data.verdict, data.industryOverview, body].filter(Boolean).join("\n")
  if (unsupportedAudience.test(text)) flag("generic_audience", section, slug, "unsupported generic user-size or enterprise claim")
  if (fakeScale.test(text)) flag("fabricated_scale_claim", section, slug, "bulk-scale testing claim requires direct evidence")
  if (body.length > 20000 && (/<a\b[^>]*<a\b/i.test(body) || /Solutions Evaluated:\s*\d+\+/i.test(body))) {
    flag("bulk_generated_body", section, slug, "large legacy HTML with suspicious links or unevidenced claims")
  }
  if (/<a\b[^>]*<a\b/i.test(body) || /<a\b[^>]*href="[^"]*<a\b/i.test(body)) {
    flag("malformed_html", section, slug, "nested/broken anchor source")
  }
  if (section === "reviews") {
    const authoredWords = (data.content || []).reduce((n, item) =>
      n + words(item.body) + (item.items || []).reduce((v, x) => v + words(x), 0), 0)
    if (authoredWords < 160) flag("thin_source", section, slug, "original review sections under 160 words (before runtime filler)")
    if (Number(data.rating) > 0 && data.ratingVerified !== true && !String(data.scoreBasis || "").trim()) {
      flag("score_provenance", section, slug, "provisional rating lacks a score provenance note")
    }
  } else if (section === "comparisons") {
    const features = Array.isArray(data.features) ? data.features : []
    if (features.length === 0 || features.every((r) =>
      !String(r.tool1Detail || "").trim() && !String(r.tool2Detail || "").trim() &&
      /^(?:unknown|confirm|test|n\/a|not recorded|—|-)?$/i.test(String(r.tool1 ?? "")))) {
      flag("empty_comparison", section, slug, "feature table lacks buyer-useful evidence")
    }
    if (words(data.verdict) < 45) flag("missing_verdict", section, slug, "source verdict too short to support a decision")
    const left = get("reviews", data.tool1Slug)
    const right = get("reviews", data.tool2Slug)
    if (left?.category && right?.category && left.category !== right.category) {
      flag("cross_category_comparison", section, slug, "review categories differ: " + left.category + " / " + right.category + "; audit buyer intent")
    }
  } else if (section === "guides") {
    const textWords = (data.sections || []).reduce((n, item) => n + words(item.body), 0)
    if (textWords < 250) flag("thin_source", section, slug, "original guide sections under 250 words")
  } else if (section === "best" || section === "use-cases") {
    const bodyWords = words(data.body)
    if (bodyWords < 180 && (data.criteria || data.selectionCriteria || []).length < 4) {
      flag("thin_source", section, slug, "short long-form analysis and few selection criteria")
    }
  }
}
findings.sort((a, b) =>
  a.severity - b.severity || a.type.localeCompare(b.type) ||
  a.section.localeCompare(b.section) || a.slug.localeCompare(b.slug))
const byType = Object.fromEntries(
  [...new Set(findings.map((x) => x.type))].sort().map((key) => [key, findings.filter((x) => x.type === key).length])
)
const report = {
  generatedAt: new Date().toISOString(),
  scannedRecords: records.size,
  recordsBySection: counts,
  findingCount: findings.length,
  findingTypes: byType,
  findings,
}
console.log("PilotStack read-only content audit")
console.log("Records:", records.size, "Findings:", findings.length)
console.log("By type:", JSON.stringify(byType))
for (const f of findings.slice(0, 24)) {
  console.log("[P" + f.severity + "]", f.type, f.section + "/" + f.slug, "-", f.note)
}
const outputIndex = process.argv.indexOf("--json")
if (outputIndex >= 0 && process.argv[outputIndex + 1]) {
  const target = path.resolve(process.argv[outputIndex + 1])
  fs.mkdirSync(path.dirname(target), { recursive: true })
  fs.writeFileSync(target, JSON.stringify(report, null, 2) + "\n")
  console.log("JSON report:", target)
}
