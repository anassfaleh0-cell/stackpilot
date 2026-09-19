#!/usr/bin/env node

/**
 * noindex-audit.mjs
 * 
 * Scans content directories, scores each file, and outputs a noindex-list.json
 * with slugs that should be noindexed (low quality).
 * 
 * Usage: node scripts/noindex-audit.mjs
 * 
 * Scoring:
 *   - Word count (0-25 pts): <100 = 0, 100-300 = 10, 300-600 = 20, 600+ = 25
 *   - Unique data (0-20 pts): has pricing, features, ratings = 20, partial = 10, none = 0
 *   - Original content (0-20 pts): has screenshots/images = 20, has "tested" = 15, none = 0
 *   - Author field (0-10 pts): has author = 10, none = 0
 *   - Freshness (0-15 pts): updated <90 days = 15, <180 days = 10, <365 days = 5, old = 0
 *   - Depth (0-10 pts): >10 sections = 10, >5 = 7, >3 = 4, else = 0
 */

import fs from "fs"
import path from "path"

const CONTENT_DIR = path.resolve(process.cwd(), "content")
const OUTPUT_FILE = path.resolve(process.cwd(), "noindex-list.json")

const DIRECTORIES = [
  { dir: "comparisons", keepTop: 50, label: "Comparisons" },
  { dir: "best", keepTop: 20, label: "Best" },
  { dir: "glossary", keepTop: 30, label: "Glossary" },
  { dir: "statistics", keepTop: 20, label: "Statistics" },
  { dir: "alternatives", keepTop: 30, label: "Alternatives" },
  { dir: "guides", keepTop: 50, label: "Guides" },
  { dir: "blog", keepTop: 97, label: "Blog (keep all)" },
  { dir: "reviews", keepTop: 151, label: "Reviews (keep all)" },
]

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length
}

function scoreFile(filePath, dirName) {
  let raw
  try {
    raw = fs.readFileSync(filePath, "utf-8")
  } catch {
    return 0
  }

  let data
  try {
    data = JSON.parse(raw)
  } catch {
    return 0
  }

  const slug = data.slug || path.basename(filePath, ".json")
  let score = 0

  // 1. Word count (0-25 pts)
  const allText = [
    data.description || "",
    data.tagline || "",
    data.body || "",
    data.verdict || "",
    ...(data.content || []).map((s) => s.body || ""),
    ...(data.sections || []).map((s) => s.body || ""),
  ].join(" ")
  const words = countWords(allText)
  if (words >= 600) score += 25
  else if (words >= 300) score += 20
  else if (words >= 100) score += 10

  // 2. Unique data points (0-20 pts)
  let dataPoints = 0
  if (data.pricing || data.priceRange) dataPoints++
  if (data.features && data.features.length > 0) dataPoints++
  if (data.rating || data.ratings) dataPoints++
  if (data.pros && data.pros.length > 0) dataPoints++
  if (data.cons && data.cons.length > 0) dataPoints++
  if (data.faqs && data.faqs.length > 0) dataPoints++
  if (data.alternatives && data.alternatives.length > 0) dataPoints++
  score += Math.min(20, dataPoints * 3)

  // 3. Original content signals (0-20 pts)
  const hasImages = allText.includes("screenshot") || allText.includes("![") || 
    allText.includes("img/") || allText.includes("/images/") ||
    (data.content || []).some((s) => s.type === "image") ||
    (data.sections || []).some((s) => s.images && s.images.length > 0)
  const hasTested = allText.toLowerCase().includes("tested") || allText.toLowerCase().includes("hands-on") || 
    allText.toLowerCase().includes("we tried") || allText.toLowerCase().includes("our experience")
  if (hasImages) score += 20
  else if (hasTested) score += 15

  // 4. Author field (0-10 pts)
  if (data.author && data.author !== "PilotStack Team" && data.author.length > 3) score += 10
  else if (data.author) score += 5

  // 5. Freshness (0-15 pts)
  const lastReviewed = data.lastReviewed || data.lastUpdated || data.publishedAt
  if (lastReviewed) {
    const daysSince = Math.floor((Date.now() - new Date(lastReviewed).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince < 90) score += 15
    else if (daysSince < 180) score += 10
    else if (daysSince < 365) score += 5
  }

  // 6. Depth (0-10 pts)
  const sections = data.content || data.sections || []
  if (sections.length >= 10) score += 10
  else if (sections.length >= 5) score += 7
  else if (sections.length >= 3) score += 4

  // Bonus: if noindex-worthy signal
  const isThin = words < 150 && !hasTested
  const isDuplicate = dirName === "comparisons" && sections.length < 3

  return {
    slug,
    score,
    words,
    dir: dirName,
    hasImages,
    hasTested,
    author: data.author || "none",
    lastReviewed: lastReviewed || "unknown",
    sections: sections.length,
    isThin,
    isDuplicate,
  }
}

function main() {
  const results = {}
  const allFiles = []

  for (const { dir, keepTop, label } of DIRECTORIES) {
    const dirPath = path.join(CONTENT_DIR, dir)
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory not found: ${dir}`)
      continue
    }

    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"))
    console.log(`📂 ${label}: ${files.length} files`)

    const scored = files.map((f) => {
      const filePath = path.join(dirPath, f)
      return scoreFile(filePath, dir)
    }).sort((a, b) => b.score - a.score)

    const keepSlugs = scored.slice(0, keepTop).map((s) => s.slug)
    const noindexSlugs = scored.slice(keepTop).map((s) => s.slug)

    results[dir] = {
      total: files.length,
      keep: keepSlugs,
      noindex: noindexSlugs,
      keepTop,
      stats: {
        avgScore: Math.round(scored.reduce((a, s) => a + s.score, 0) / scored.length),
        avgWords: Math.round(scored.reduce((a, s) => a + s.words, 0) / scored.length),
        thinContent: scored.filter((s) => s.isThin).length,
      },
    }

    allFiles.push(...scored.map((s) => ({ ...s, keep: keepSlugs.includes(s.slug) })))

    console.log(`   ✅ Keep: ${keepSlugs.length} | 🚫 Noindex: ${noindexSlugs.length}`)
    console.log(`   📊 Avg score: ${results[dir].stats.avgScore} | Avg words: ${results[dir].stats.avgWords}`)
    console.log(`   ⚠️  Thin content: ${results[dir].stats.thinContent}`)
    console.log()
  }

  // Write output
  const output = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalFiles: allFiles.length,
      totalKeep: allFiles.filter((f) => f.keep).length,
      totalNoindex: allFiles.filter((f) => !f.keep).length,
    },
    directories: results,
    allFiles: allFiles.sort((a, b) => b.score - a.score),
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2))
  console.log(`✅ Output written to ${OUTPUT_FILE}`)
  console.log(`\n📊 SUMMARY:`)
  console.log(`   Total files: ${output.summary.totalFiles}`)
  console.log(`   Keep: ${output.summary.totalKeep}`)
  console.log(`   Noindex: ${output.summary.totalNoindex}`)
}

main()
