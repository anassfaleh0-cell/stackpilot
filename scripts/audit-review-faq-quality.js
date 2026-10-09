#!/usr/bin/env node
const fs = require("node:fs")
const path = require("node:path")

const root = path.resolve(process.cwd(), "content/reviews")
const brokenPatterns = [
  /\bcombines\s*\./i,
  /\bintermittent connect\b/i,
  /\bdependency mapp\b/i,
  /\b(?:connect|mapp|functionality)\s*\./i,
]
const genericPatterns = [
  /^the best choice depends on your team'?s specific workflow requirements and existing technology stack\.?$/i,
  /^understanding these constraints before purchasing helps set realistic expectations\.?$/i,
  /^these features make .+ suitable for teams of most sizes\.?$/i,
  /^teams should assess their needs against free tier limitations before upgrading\.?$/i,
]
const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
const files = fs.existsSync(root) ? fs.readdirSync(root).filter((name) => name.endsWith(".json")).sort() : []
const findings = { files: files.length, brokenAnswers: [], genericAnswers: [], duplicateQuestions: [], duplicateAnswers: [] }

for (const file of files) {
  const fullPath = path.join(root, file)
  let data
  try {
    data = JSON.parse(fs.readFileSync(fullPath, "utf8"))
  } catch (error) {
    findings.brokenAnswers.push({ file, issue: "invalid JSON" })
    continue
  }
  const questions = new Set()
  const answers = new Set()
  for (const faq of Array.isArray(data.faqs) ? data.faqs : []) {
    if (!faq || typeof faq.question !== "string" || typeof faq.answer !== "string") {
      findings.brokenAnswers.push({ file, question: String(faq?.question || ""), issue: "missing question or answer" })
      continue
    }
    const question = faq.question.trim()
    const answer = faq.answer.replace(/\s+/g, " ").trim()
    const qKey = normalize(question)
    const aKey = normalize(answer)
    if (brokenPatterns.some((pattern) => pattern.test(answer))) {
      findings.brokenAnswers.push({ file, question, excerpt: answer.slice(0, 140) })
    }
    if (genericPatterns.some((pattern) => pattern.test(answer))) {
      findings.genericAnswers.push({ file, question, excerpt: answer.slice(0, 140) })
    }
    if (qKey && questions.has(qKey)) findings.duplicateQuestions.push({ file, question })
    if (aKey && answers.has(aKey)) findings.duplicateAnswers.push({ file, question, excerpt: answer.slice(0, 140) })
    if (qKey) questions.add(qKey)
    if (aKey) answers.add(aKey)
  }
}
const sample = (list) => list.slice(0, 10)
console.log("[review-faq-audit] REPORT ONLY — no files modified; findings require editorial review")
console.log("Review files:", findings.files)
for (const [key, values] of Object.entries(findings)) {
  if (key === "files") continue
  console.log(key + ":", values.length, "sample:", JSON.stringify(sample(values)))
}
