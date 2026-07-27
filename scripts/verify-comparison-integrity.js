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
let totalRepeatedSubstrings = 0
let totalDoubledWords = 0
let filesWithIssues = new Set()

const literalFiles = []
const fragmentFiles = []
const emptyListFiles = []
const duplicateFiles = []
const truncatedFiles = []
const repeatedSubstringFiles = []
const doubledWordFiles = []

const DANGLING_CONNECTOR_PATTERNS = [
  /(?:^|\.\s)(?:reduction for|principles ensure|validated\.|requirements are|compliant with)\b/gi,
  /\bfor -[a-z]/gi,
  /(?:via|uses|is|maintains|provides|supports|offers)  +[a-z]/gi,
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
  /\bour\s+\.\s/g,
  /\bfor\s+\.\s/g,
  /\busing\s+our\s+\./g,
  /\bUse\s+our\s+to\b/g,
  /\blike\s+for\b/g,
  /\bour\s+provides\b/g,
  /\bour\s+highlights\b/g,
  /\bneed\s+for\s+\./g,
  /\bcomprehensive\s+,/g,
]

function findRepeatedSentences(text) {
  if (text.length < 40) return []
  const cleaned = text.replace(/<[^>]+>/g, "").trim()
  const sentences = cleaned.split(/(?<=[.!?])\s+/)
  if (sentences.length < 2) return []
  const seen = new Map()
  const results = []
  for (let i = 0; i < sentences.length; i++) {
    const s = sentences[i].trim().toLowerCase()
    if (s.length < 20) continue
    if (seen.has(s)) {
      if (i - seen.get(s) <= 3) {
        results.push(s.substring(0, 60))
        if (results.length >= 3) break
      }
    } else {
      seen.set(s, i)
    }
  }
  return results
}

function findDoubledWords(text) {
  const results = []
  const m = text.match(/\b(\w+)\s+\1\b/gi)
  if (m) results.push(...m)
  return results
}

function findDoubledWordsAcrossTags(text) {
  const results = []
  const stripped = text.replace(/<[^>]+>/g, " ")

  // Check adjacent duplicates after stripping tags
  const m = stripped.match(/\b(\w+)\s+\1\b/gi)
  if (m) {
    for (const match of m) {
      const words = match.split(/\s+/).filter(Boolean)
      if (words.length === 2) {
        const w = words[0].toLowerCase()
        // Skip short prepositions/conjunctions
        if (["per", "vs", "for", "in", "to", "of", "on", "at", "by", "the", "a", "an"].includes(w)) continue
        results.push(match)
      }
    }
  }

  // Check for the same word repeated with one intervening word (across tags)
  // e.g. "is ... is" in "is <a>GDPR</a> is compliant"
  const m2 = stripped.match(/\b(\w+)\s+\w{1,30}\s+\1\b/gi)
  if (m2) {
    for (const match of m2) {
      const words = match.split(/\s+/).filter(Boolean)
      if (words.length >= 2 && words[0].toLowerCase() === words[words.length - 1].toLowerCase()) {
        const w = words[0].toLowerCase()
        // Skip "X provides X" patterns (valid: "Moz provides Moz AI")
        // Skip "X offers X", "X has X", "X includes X"
        const middleWord = words.length === 3 ? words[1].toLowerCase() : ""
        if (["provides", "offers", "includes", "has", "supports", "delivers"].includes(middleWord)) continue
        // Skip "and X and" list patterns
        if (w === "and" || w === "or") continue
        // Skip common valid patterns: "per X per", "Custom vs Custom", "per user per"
        if (["per", "vs", "custom"].includes(w) || ["per", "vs"].includes(middleWord)) continue
        results.push(match)
      }
    }
  }
  return results
}

function getFields(data) {
  const fields = []
  if (data.description) fields.push({ name: "description", value: data.description })
  if (data.verdict) fields.push({ name: "verdict", value: data.verdict })
  if (data.features) {
    for (const f of data.features) {
      if (f.tool1Detail) fields.push({ name: `tool1Detail(${f.name})`, value: f.tool1Detail })
      if (f.tool2Detail) fields.push({ name: `tool2Detail(${f.name})`, value: f.tool2Detail })
    }
  }
  if (data.faqs) {
    for (let i = 0; i < data.faqs.length; i++) {
      if (data.faqs[i].question) fields.push({ name: `faq[${i}].question`, value: data.faqs[i].question })
      if (data.faqs[i].answer) fields.push({ name: `faq[${i}].answer`, value: data.faqs[i].answer })
    }
  }
  return fields
}

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

  // Check 3: empty comma-separated lists / dangling determiners
  let emptyCount = 0
  for (const pattern of EMPTY_LIST_PATTERNS) {
    const m = fullText.match(pattern)
    if (m) emptyCount += m.length
  }
  if (emptyCount > 0) {
    totalEmptyLists += emptyCount
    emptyListFiles.push({ file, count: emptyCount, patterns: EMPTY_LIST_PATTERNS.filter(p => fullText.match(p)).map(p => p.source) })
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
  if (data.verdict) {
    const truncatedMatches = data.verdict.match(/(?:Choose\s+\w+\s+if:?\s*\n\s*-\s*\w+.*?\n\s*-\s*\w+.*?\n\s*-\s*$)|(?:\d+\.\s+\w+\s+if\s*$)/gm)
    if (truncatedMatches) {
      totalTruncated += truncatedMatches.length
      truncatedFiles.push({ file, count: truncatedMatches.length })
      filesWithIssues.add(file)
    }
  }

  // Check 6: repeated sentences (20+ chars) within individual fields - catches
  //          the exact bug pattern where a sentence is duplicated back-to-back
  const fields = getFields(data)
  let fieldReps = []
  for (const field of fields) {
    const reps = findRepeatedSentences(field.value)
    if (reps.length > 0) {
      fieldReps.push({ field: field.name, sentences: reps })
    }
  }
  if (fieldReps.length > 0) {
    totalRepeatedSubstrings += fieldReps.reduce((s, fr) => s + fr.sentences.length, 0)
    repeatedSubstringFiles.push({ file, fields: fieldReps })
    filesWithIssues.add(file)
  }

  // Check 7: doubled words (e.g. "cost cost", "is is", including across HTML tags)
  let dwFields = []
  for (const field of fields) {
    const dw = findDoubledWords(field.value)
    const dw2 = findDoubledWordsAcrossTags(field.value)
    const all = [...new Set([...dw, ...dw2])]
    if (all.length > 0) {
      dwFields.push({ field: field.name, words: all })
    }
  }
  if (dwFields.length > 0) {
    totalDoubledWords += dwFields.reduce((s, f) => s + f.words.length, 0)
    doubledWordFiles.push({ file, fields: dwFields })
    filesWithIssues.add(file)
  }
}

const grandTotal = totalLiteral + totalFragments + totalEmptyLists + totalDuplicates + totalTruncated + totalRepeatedSubstrings + totalDoubledWords

console.log(`\n${"=".repeat(70)}`)
console.log(`COMPARISON INTEGRITY VERIFICATION REPORT`)
console.log(`${"=".repeat(70)}`)
console.log(`Total files scanned: ${files.length}`)
console.log(`Files with issues: ${filesWithIssues.size}`)
console.log(`\n${"-".repeat(70)}`)
console.log(`BUG TYPE COUNTS:`)
console.log(`${"-".repeat(70)}`)
console.log(`  1. Literal "\${" in rendered fields:        ${totalLiteral}`)
console.log(`  2. Dangling sentence fragments:              ${totalFragments}`)
console.log(`  3. Empty lists / dangling determiners:       ${totalEmptyLists}`)
console.log(`  4. Duplicate feature names:                  ${totalDuplicates}`)
console.log(`  5. Truncated Decision Framework items:       ${totalTruncated}`)
console.log(`  6. Repeated substrings (20+ chars):          ${totalRepeatedSubstrings}`)
console.log(`  7. Doubled words:                            ${totalDoubledWords}`)
console.log(`${"-".repeat(70)}`)
console.log(`  TOTAL BUGS:                                  ${grandTotal}`)
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
  console.log(`\n--- Files with empty lists/determiners ---`)
  for (const { file, count, patterns } of emptyListFiles) {
    console.log(`  ${file}: ${count} empty list(s) - patterns: ${patterns.join(", ")}`)
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

if (repeatedSubstringFiles.length > 0) {
  console.log(`\n--- Files with repeated sentences ---`)
  for (const { file, fields } of repeatedSubstringFiles) {
    console.log(`  ${file}:`)
    for (const f of fields) {
      console.log(`    ${f.field}: ${JSON.stringify(f.sentences.slice(0, 3))}`)
    }
  }
}

if (doubledWordFiles.length > 0) {
  console.log(`\n--- Files with doubled words ---`)
  for (const { file, fields } of doubledWordFiles) {
    console.log(`  ${file}:`)
    for (const f of fields) {
      console.log(`    ${f.field}: ${f.words.join(", ")}`)
    }
  }
}

console.log(`\n${"=".repeat(70)}`)
if (grandTotal === 0) {
  console.log(`ALL CHECKS PASSED - 0 bugs found across ${files.length} files`)
} else {
  console.log(`FAILED - ${grandTotal} bug(s) found across ${filesWithIssues.size} file(s)`)
}
console.log(`${"=".repeat(70)}\n`)

process.exit(grandTotal > 0 ? 1 : 0)
