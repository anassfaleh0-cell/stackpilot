#!/usr/bin/env node
const fs = require("node:fs")
const path = require("node:path")

const directory = path.resolve(process.cwd(), "content/guides")
const files = fs.existsSync(directory) ? fs.readdirSync(directory).filter((name) => name.endsWith(".json")).sort() : []
const issues = []
const thin = []
const templateHits = []
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
  const fullText = editorialText.join("\n")
  const hits = templatePatterns.filter((pattern) => pattern.test(fullText)).map((pattern) => pattern.source)
  if (hits.length) templateHits.push({ slug: data.slug, hits })
}

console.log("[guide-quality-audit] Report-only editorial heuristic; word count does not prove quality.")
console.log("Guide files:", files.length)
console.log("Schema/JSON errors:", issues.length, JSON.stringify(issues.slice(0, 20)))
console.log("Guides below 500 audited source words:", thin.length, JSON.stringify(thin.slice(0, 30)))
console.log("Known template phrase matches:", templateHits.length, JSON.stringify(templateHits.slice(0, 30)))
if (issues.length > 0) process.exitCode = 1
