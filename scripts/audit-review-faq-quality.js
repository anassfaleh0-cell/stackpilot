#!/usr/bin/env node
const fs = require("node:fs")
const path = require("node:path")

const contentRoot = path.resolve(process.cwd(), "content")
const contentDirs = ["reviews", "comparisons", "alternatives", "best", "use-cases", "industries", "guides"]
const brokenPatterns = [
  /\bcombines\s*\./i,
  /\bintermittent connect\b/i,
  /\bdependency mapp\b/i,
]
const genericPatterns = [
  /^the best choice depends on your team'?s specific workflow requirements and existing technology stack\.?$/i,
  /^understanding these constraints before purchasing helps set realistic expectations\.?$/i,
  /^these features make .+ suitable for teams of most sizes\.?$/i,
  /^teams should assess their needs against free tier limitations before upgrading\.?$/i,
]
const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
function getFaqItems(data) {
  if (Array.isArray(data.faqs) && data.faqs.length > 0) return data.faqs
  const section = Array.isArray(data.sections)
    ? data.sections.find((item) => item?.type === "list" && /frequently asked/i.test(item.title || "") && Array.isArray(item.items))
    : null
  if (!section) return []
  return section.items.flatMap((raw) => {
    if (typeof raw !== "string") return []
    const text = raw.trim().replace(/^\*\*/, "")
    const bold = text.match(/^\*\*(.+?)\*\*\s*([\s\S]+)$/)
    if (bold) return [{ question: bold[1].trim(), answer: bold[2].trim() }]
    const end = text.indexOf("? ")
    return end > 0 ? [{ question: text.slice(0, end + 1).trim(), answer: text.slice(end + 2).trim() }] : []
  })
}
const files = contentDirs.flatMap((dir) => {
  const folder = path.join(contentRoot, dir)
  return fs.existsSync(folder)
    ? fs.readdirSync(folder).filter((name) => name.endsWith(".json")).sort().map((name) => ({ dir, name }))
    : []
})
const findings = { files: files.length, brokenAnswers: [], genericAnswers: [], duplicateQuestions: [], duplicateAnswers: [] }

for (const { dir, name: file } of files) {
  const fullPath = path.join(contentRoot, dir, file)
  const relativePath = path.relative(process.cwd(), fullPath)
  let data
  try {
    data = JSON.parse(fs.readFileSync(fullPath, "utf8"))
  } catch (error) {
    findings.brokenAnswers.push({ file: relativePath, issue: "invalid JSON" })
    continue
  }
  const questions = new Set()
  const answers = new Set()
  for (const faq of getFaqItems(data)) {
    if (!faq || typeof faq.question !== "string" || typeof faq.answer !== "string") {
      findings.brokenAnswers.push({ file: relativePath, question: String(faq?.question || ""), issue: "missing question or answer" })
      continue
    }
    const question = faq.question.trim()
    const answer = faq.answer.replace(/\s+/g, " ").trim()
    const qKey = normalize(question)
    const aKey = normalize(answer)
    if (brokenPatterns.some((pattern) => pattern.test(answer))) {
      findings.brokenAnswers.push({ file: relativePath, question, excerpt: answer.slice(0, 140) })
    }
    if (genericPatterns.some((pattern) => pattern.test(answer))) {
      findings.genericAnswers.push({ file: relativePath, question, excerpt: answer.slice(0, 140) })
    }
    if (qKey && questions.has(qKey)) findings.duplicateQuestions.push({ file: relativePath, question })
    if (aKey && answers.has(aKey)) findings.duplicateAnswers.push({ file: relativePath, question, excerpt: answer.slice(0, 140) })
    if (qKey) questions.add(qKey)
    if (aKey) answers.add(aKey)
  }
}
const sample = (list) => list.slice(0, 10)
console.log("[editorial-faq-audit] REPORT ONLY — no files modified; findings require editorial review")
console.log("Editorial files scanned:", findings.files)
for (const [key, values] of Object.entries(findings)) {
  if (key === "files") continue
  console.log(key + ":", values.length, "sample:", JSON.stringify(sample(values)))
}
