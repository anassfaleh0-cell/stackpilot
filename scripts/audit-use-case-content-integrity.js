#!/usr/bin/env node
// Guard against the malformed generated use-case bodies that previously produced
// nested anchors, split words, placeholder H1s, and unsupported ROI promises.
const fs = require("node:fs")
const path = require("node:path")

const root = path.join(__dirname, "..", "content", "use-cases")
const files = fs.readdirSync(root).filter((file) => file.endsWith(".json")).sort()
const errors = []
const warnings = []

function wordCount(html) {
  const text = String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:amp|lt|gt|quot|#39);/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text ? text.split(" ").length : 0
}

for (const file of files) {
  const fullPath = path.join(root, file)
  let data
  try {
    data = JSON.parse(fs.readFileSync(fullPath, "utf8"))
  } catch (error) {
    errors.push(`${file}: invalid JSON (${error.message})`)
    continue
  }
  const body = typeof data.body === "string" ? data.body : ""
  const checks = [
    [/ <a\b[^>]*<a\b/i, "nested anchor markup"],
    [/<a\b[^>]*<a\b/i, "nested anchor markup"],
    [/\brepresents a critical workflow\b/i, "generic slug-placeholder prose"],
    [/\bTypical ROI:\s*\d/i, "unsupported exact ROI promise"],
    [/\b\d{1,2}-\d{1,2}%\s+(?:improvement|faster|reduction)\b/i, "unsupported precise outcome percentage"],
    [new RegExp(`\\b${String(data.slug || "").replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\s*:\\s*Complete Guide\\b`, "i"), "slug-based placeholder heading"],
  ]
  for (const [pattern, label] of checks) {
    if (pattern.test(body)) errors.push(`${file}: ${label}`)
  }
  if (body && typeof data.wordCount === "number") {
    const actual = wordCount(body)
    const tolerance = Math.max(20, Math.ceil(actual * 0.05))
    if (Math.abs(actual - data.wordCount) > tolerance) {
      warnings.push(`${file}: wordCount metadata is ${data.wordCount}; body contains about ${actual} words`)
    }
  }
}

console.log(`Use-case content integrity: ${files.length} files scanned, ${errors.length} blocking issue(s), ${warnings.length} word-count warning(s).`)
for (const item of errors) console.error("ERROR " + item)
for (const item of warnings) console.warn("WARN " + item)
if (errors.length) process.exitCode = 1
