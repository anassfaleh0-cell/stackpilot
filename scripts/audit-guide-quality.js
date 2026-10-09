#!/usr/bin/env node
const fs = require("node:fs")
const path = require("node:path")

const directory = path.resolve(process.cwd(), "content/guides")
const files = fs.existsSync(directory) ? fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort() : []
const issues = []
const thin = []
const templateHits = []
const emptyRelations = []
const staleDates = []
const readingTimeMismatches = []
const invalidRelatedGuides = []
const duplicateRelatedGuides = []
const knownGuideSlugs = new Set(files.map((name) => name.replace(/\\.json$/, "")))
const count = (value) => typeof value === "string" ? value.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length : 0
const templatePatterns = [
  /choosing the right .* software starts with understanding your specific requirements/i,
  /most successful deployments follow a phased approach rather than a big-bang rollout/i,
  /most teams see positive roi within 3-6 months/i,
  /is positioned to benefit from trends like ai-powered automation/i,
  /this guide walks through the key considerations/i,
]

for (const file of files) {
  const fullPath = path.join(directory, file)
  let data
  try {
    data = JSON.parse(fs.readFileSync(fullPath, "utf8"))
  } catch (error) {
    issues.push({ file, issue: "invalid JSON", detail: String(error) })
    continue
  }
  if (typeof data.slug !== "string" || typeof data.title !== "string" || typeof data.description !== "string" || !Array.isArray(data.sections)) {
    issues.push({ file, issue: "missing slug/title/description/sections schema" })
    continue
  }
  let words = count(data.title) + count(data.description)
  const editorialText = [data.title, data.description]
  for (const section of data.sections) {
    if (!section || typeof section.title !== "string" || typeof section.body !== "string" || !section.title.trim() || !section.body.trim()) {
      issues.push({ file, issue: "section missing title/body strings" })
      continue
    }
    words += count(section.title) + count(section.body)
    for (const item of section.items || []) words += count(item)
    editorialText.push(section.title, section.body, ...(section.items || []))
  }
  if (words < 500) thin.push({ slug: data.slug, words, lastUpdated: data.lastUpdated || null })
  const relatedGuides = Array.isArray(data.relatedGuides) ? data.relatedGuides : []
  const seenRelatedGuides = new Set()
  for (const relatedSlug of relatedGuides) {
    if (typeof relatedSlug !== "string" || !knownGuideSlugs.has(relatedSlug) || relatedSlug === data.slug) {
      invalidRelatedGuides.push({ slug: data.slug, relatedSlug })
    }
    if (seenRelatedGuides.has(relatedSlug)) duplicateRelatedGuides.push({ slug: data.slug, relatedSlug })
    seenRelatedGuides.add(relatedSlug)
  }
  if ((!Array.isArray(data.relatedTools) || data.relatedTools.length === 0) &&
      (!Array.isArray(data.relatedGuides) || data.relatedGuides.length === 0)) {
    emptyRelations.push({ slug: data.slug, relatedTools: data.relatedTools || [], relatedGuides: data.relatedGuides || [] })
  }
  const parsedDate = typeof data.lastUpdated === "string" ? new Date(data.lastUpdated) : null
  if (!parsedDate || Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() > Date.now() + 86400000 || Date.now() - parsedDate.getTime() > 365 * 86400000) {
    staleDates.push({ slug: data.slug, lastUpdated: data.lastUpdated || null })
  }
  const expectedReadingTime = Math.max(3, Math.ceil(words / 200))
  if (Number.isFinite(data.readingTime) && data.readingTime !== expectedReadingTime) {
    readingTimeMismatches.push({ slug: data.slug, stored: data.readingTime, expected: expectedReadingTime, words })
  }
  const fullText = editorialText.join("\n")
  const hits = templatePatterns.filter((pattern) => pattern.test(fullText)).map((pattern) => pattern.source)
  if (hits.length) templateHits.push({ slug: data.slug, hits })
}

console.log("[guide-quality-audit] Report-only editorial heuristic; word count does not prove quality.")
console.log("Guide files:", files.length)
console.log("Schema/JSON errors:", issues.length, JSON.stringify(issues.slice(0, 20)))
console.log("Guides below 500 audited source words:", thin.length, JSON.stringify(thin.slice(0, 30)))
console.log("Known template phrase matches:", templateHits.length, JSON.stringify(templateHits.slice(0, 30)))
console.log("Guides without related tools/guides:", emptyRelations.length, JSON.stringify(emptyRelations.slice(0, 30)))
console.log("Invalid/self related-guide references:", invalidRelatedGuides.length, JSON.stringify(invalidRelatedGuides.slice(0, 30)))
console.log("Duplicate related-guide references:", duplicateRelatedGuides.length, JSON.stringify(duplicateRelatedGuides.slice(0, 30)))
console.log("Guides with missing, stale, or malformed lastUpdated dates:", staleDates.length, JSON.stringify(staleDates.slice(0, 30)))
console.log("Reading-time values needing review:", readingTimeMismatches.length, JSON.stringify(readingTimeMismatches.slice(0, 30)))
if (issues.length > 0) process.exitCode = 1
