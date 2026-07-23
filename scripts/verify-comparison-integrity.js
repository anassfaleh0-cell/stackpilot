#!/usr/bin/env node
const fs = require("fs")
const path = require("path")

const COMPARISONS_DIR = path.join(__dirname, "..", "content", "comparisons")

const files = fs.readdirSync(COMPARISONS_DIR).filter(f => f.endsWith(".json"))

let totalLiteral = 0
let totalFragments = 0
let totalEmptyLists = 0
let totalDuplicates = 0
let totalTruncated = 0
let filesWithIssues = new Set()

const literalFiles = []
const fragmentFiles = []
const emptyListFiles = []
const duplicateFiles = []
const truncatedFiles = []

const FRAGMENT_PATTERNS = [
  /\.\s+reduction for\b/gi,
  /\.\s+principles ensure\b/gi,
  /\.\s+validated\./gi,
  /\.\s+requirements are\b/gi,
  /\.\s+compliant with\b/gi,
  /\bfor -\w/gi,
  /\bvia  +\w/gi,
  /\buses  +\w/gi,
  /\bis  +\w/gi,
  /\bmaintains  +\w/gi,
  /\bprovides  +\w/gi,
  /\bsupports  +\w/gi,
  /\boffers  +\w/gi,
  /\bconnects with \./gi,
  /\bintegrates with \./gi,
  /\bholds  certifications/gi,
  /\bcertified with \./gi,
  /\balligned to  \w/gi,
]

const EMPTY_LIST_PATTERNS = [
  /,\s*,/g,
  /with\s+,\s*/g,
  /including\s+,\s*/g,
  /including\s+\.\s/g,
  /with\s+\.\s/g,
  /and\s+\.\s/g,
  /\bintegrates with\s*,\s*,/g,
  /\bconnects with\s*,\s*,/g,
]

const DANGLING_CONNECTOR_PATTERNS = [
  /(?:^|\.\s)(?:reduction for|principles ensure|validated\.|requirements are|compliant with)\b/gi,
  /\bfor -[a-z]/gi,
  /(?:via|uses|is|maintains|provides|supports|offers)  +[a-z]/gi,
]

for (const file of files) {
  const filePath = path.join(COMPARISONS_DIR, file)
  let data
  try {
    data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch (e) {
    console.error(`PARSE ERROR: ${file} - ${e.message}`)
    continue
  }

  const allText = []
  if (data.description) allText.push(data.description)
  if (data.verdict) allText.push(data.verdict)
  if (data.features) {
    for (const f of data.features) {
      if (f.name) allText.push(f.name)
      if (f.tool1Detail) allText.push(f.tool1Detail)
      if (f.tool2Detail) allText.push(f.tool2Detail)
    }
  }
  if (data.faqs) {
    for (const fa of data.faqs) {
      if (fa.question) allText.push(fa.question)
      if (fa.answer) allText.push(fa.answer)
    }
  }

  const fullText = allText.join("\n")

  // Check 1: literal "${" in any field
  const literalMatches = fullText.match(/\$\{[^}]*\}/g)
  if (literalMatches) {
    totalLiteral += literalMatches.length
    literalFiles.push({ file, matches: literalMatches.slice(0, 5) })
    filesWithIssues.add(file)
  }

  // Check 2: dangling sentence fragments
  let fragCount = 0
  for (const pattern of DANGLING_CONNECTOR_PATTERNS) {
    const m = fullText.match(pattern)
    if (m) fragCount += m.length
  }
  if (fragCount > 0) {
    totalFragments += fragCount
    fragmentFiles.push({ file, count: fragCount })
    filesWithIssues.add(file)
  }

  // Check 3: empty comma-separated lists
  let emptyCount = 0
  for (const pattern of EMPTY_LIST_PATTERNS) {
    const m = fullText.match(pattern)
    if (m) emptyCount += m.length
  }
  if (emptyCount > 0) {
    totalEmptyLists += emptyCount
    emptyListFiles.push({ file, count: emptyCount })
    filesWithIssues.add(file)
  }

  // Check 4: duplicate feature names
  if (data.features) {
    const names = data.features.map(f => f.name)
    const seen = new Map()
    for (const name of names) {
      const lower = name.toLowerCase()
      seen.set(lower, (seen.get(lower) || 0) + 1)
    }
    const dupes = [...seen.entries()].filter(([, count]) => count > 1)
    if (dupes.length > 0) {
      totalDuplicates += dupes.reduce((sum, [, c]) => sum + c - 1, 0)
      duplicateFiles.push({ file, duplicates: dupes.map(([n, c]) => `${n} (x${c})`) })
      filesWithIssues.add(file)
    }
  }

  // Check 5: truncated Decision Framework items
  // Look for numbered items with "if" at the end (no content after)
  if (data.verdict) {
    const truncatedMatches = data.verdict.match(/(?:Choose\s+\w+\s+if:?\s*\n\s*-\s*\w+.*?\n\s*-\s*\w+.*?\n\s*-\s*$)|(?:\d+\.\s+\w+\s+if\s*$)/gm)
    if (truncatedMatches) {
      totalTruncated += truncatedMatches.length
      truncatedFiles.push({ file, count: truncatedMatches.length })
      filesWithIssues.add(file)
    }
  }
}

console.log(`\n${"=".repeat(70)}`)
console.log(`COMPARISON INTEGRITY VERIFICATION REPORT`)
console.log(`${"=".repeat(70)}`)
console.log(`Total files scanned: ${files.length}`)
console.log(`Files with issues: ${filesWithIssues.size}`)
console.log(`\n${"-".repeat(70)}`)
console.log(`BUG TYPE COUNTS:`)
console.log(`${"-".repeat(70)}`)
console.log(`  1. Literal "\${" in rendered fields:    ${totalLiteral}`)
console.log(`  2. Dangling sentence fragments:          ${totalFragments}`)
console.log(`  3. Empty comma-separated lists:          ${totalEmptyLists}`)
console.log(`  4. Duplicate feature names:              ${totalDuplicates}`)
console.log(`  5. Truncated Decision Framework items:   ${totalTruncated}`)
console.log(`${"-".repeat(70)}`)
console.log(`  TOTAL BUGS:                              ${totalLiteral + totalFragments + totalEmptyLists + totalDuplicates + totalTruncated}`)
console.log(`${"=".repeat(70)}`)

if (literalFiles.length > 0) {
  console.log(`\n--- Files with literal "\${" ---`)
  for (const { file, matches } of literalFiles) {
    console.log(`  ${file}: ${matches.join(", ")}`)
  }
}

if (fragmentFiles.length > 0) {
  console.log(`\n--- Files with dangling fragments ---`)
  for (const { file, count } of fragmentFiles) {
    console.log(`  ${file}: ${count} fragment(s)`)
  }
}

if (emptyListFiles.length > 0) {
  console.log(`\n--- Files with empty comma lists ---`)
  for (const { file, count } of emptyListFiles) {
    console.log(`  ${file}: ${count} empty list(s)`)
  }
}

if (duplicateFiles.length > 0) {
  console.log(`\n--- Files with duplicate features ---`)
  for (const { file, duplicates } of duplicateFiles) {
    console.log(`  ${file}: ${duplicates.join(", ")}`)
  }
}

if (truncatedFiles.length > 0) {
  console.log(`\n--- Files with truncated Decision Framework ---`)
  for (const { file, count } of truncatedFiles) {
    console.log(`  ${file}: ${count} truncated item(s)`)
  }
}

console.log(`\n${"=".repeat(70)}`)
if (totalLiteral + totalFragments + totalEmptyLists + totalDuplicates + totalTruncated === 0) {
  console.log(`ALL CHECKS PASSED - 0 bugs found across ${files.length} files`)
} else {
  console.log(`FAILED - ${totalLiteral + totalFragments + totalEmptyLists + totalDuplicates + totalTruncated} bug(s) found across ${filesWithIssues.size} file(s)`)
}
console.log(`${"=".repeat(70)}\n`)

process.exit(totalLiteral + totalFragments + totalEmptyLists + totalDuplicates + totalTruncated > 0 ? 1 : 0)
