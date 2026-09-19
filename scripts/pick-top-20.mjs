#!/usr/bin/env node

/**
 * pick-top-20.mjs
 * 
 * Scores ALL content (reviews + comparisons + guides) and picks the top 20
 * pages with highest potential to rank. Outputs TOP-20-TO-REWRITE.md
 * 
 * Usage: node scripts/pick-top-20.mjs
 */

import fs from "fs"
import path from "path"

const CONTENT_DIR = path.resolve(process.cwd(), "content")
const OUTPUT_FILE = path.resolve(process.cwd(), "TOP-20-TO-REWRITE.md")

function countWords(text) {
  return text.split(/\s+/).filter(Boolean).length
}

function scoreForRewrite(filePath, type) {
  let raw
  try {
    raw = fs.readFileSync(filePath, "utf-8")
  } catch {
    return null
  }

  let data
  try {
    data = JSON.parse(raw)
  } catch {
    return null
  }

  const slug = data.slug || path.basename(filePath, ".json")

  // Build full text
  const allText = [
    data.description || "",
    data.tagline || "",
    data.body || "",
    data.verdict || "",
    ...(data.content || []).map((s) => s.body || ""),
    ...(data.sections || []).map((s) => s.body || ""),
  ].join(" ")

  const words = countWords(allText)
  const sections = data.content || data.sections || []

  // Potential score: higher = more worth rewriting
  let potential = 0

  // Has good data but thin content (opportunity)
  if (data.rating && data.features && data.features.length > 5) potential += 20
  if (data.pros && data.pros.length > 2) potential += 10
  if (data.cons && data.cons.length > 2) potential += 10
  if (data.faqs && data.faqs.length > 3) potential += 10

  // Search potential (high-volume tools)
  const highValueKeywords = [
    "chatgpt", "claude", "notion", "slack", "hubspot", "salesforce", "github",
    "figma", "canva", "docker", "vercel", "stripe", "mailchimp", "zoom",
    "monday", "asana", "clickup", "trello", "jira", "linear", "obsidian",
    "semrush", "ahrefs", "zapier", "airtable", "freshbooks", "quickbooks",
    "zendesk", "intercom", "sendgrid", "twilio", "supabase", "firebase",
    "midjourney", "grammarly", "todoist", "calendly", "loom", "webflow",
    "shopify", "wordpress", "sentry", "datadog", "grafana", "terraform",
    "kubernetes", "postman", "gitlab", "bitbucket",
  ]
  if (highValueKeywords.some((kw) => slug.includes(kw))) potential += 25

  // Category bonus
  const highValueCategories = [
    "CRM & Sales", "Developer Tools", "AI & Machine Learning",
    "Project Management", "Marketing & SEO", "Finance & Accounting",
  ]
  if (highValueCategories.includes(data.category)) potential += 15

  // Freshness bonus
  const lastReviewed = data.lastReviewed || data.lastUpdated
  if (lastReviewed) {
    const daysSince = Math.floor((Date.now() - new Date(lastReviewed).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSince < 90) potential += 15
    else if (daysSince < 180) potential += 10
  }

  // Missing sections = opportunity
  const hasTested = allText.toLowerCase().includes("tested") || allText.toLowerCase().includes("hands-on")
  const hasScreenshots = allText.includes("screenshot") || allText.includes("![")
  if (!hasTested) potential += 10 // opportunity to add testing proof
  if (!hasScreenshots) potential += 5

  // Thin content = biggest opportunity
  if (words < 300) potential += 15
  else if (words < 600) potential += 10

  // URL
  const typeMap = {
    review: "reviews",
    comparison: "comparisons",
    guide: "guides",
    blog: "blog",
  }
  const url = `/${typeMap[type] || type}/${slug}`

  // Missing sections
  const missing = []
  if (!hasTested) missing.push("Original testing proof")
  if (!hasScreenshots) missing.push("Screenshots/visual proof")
  if (words < 1000) missing.push("Depth (currently <1000 words)")
  if (!data.author || data.author === "PilotStack Team") missing.push("Real author attribution")
  if (!data.pricing && !data.priceRange) missing.push("Pricing details")
  if (!data.alternatives || data.alternatives.length === 0) missing.push("Alternatives section")
  if (!data.faqs || data.faqs.length < 3) missing.push("FAQ section (need 5+)")
  if (sections.length < 5) missing.push("Content sections (need 5+)")

  // Suggested angle
  const angles = [
    `Hands-on ${data.name || slug} review with real workflow testing`,
    `${data.name || slug} vs the market: where it actually wins`,
    `${data.name || slug} pricing breakdown: what you really pay`,
    `${data.name || slug} for [specific use case]: honest assessment`,
    `I used ${data.name || slug} for [task]: here's what happened`,
  ]
  const angle = angles[Math.floor(potential % angles.length)]

  return {
    slug,
    type,
    url,
    name: data.name || slug,
    category: data.category || "Unknown",
    words,
    currentScore: data.rating || 0,
    potential,
    missing,
    suggestedAngle: angle,
    sections: sections.length,
    lastReviewed: lastReviewed || "unknown",
  }
}

function main() {
  const all = []

  // Reviews
  const reviewsDir = path.join(CONTENT_DIR, "reviews")
  if (fs.existsSync(reviewsDir)) {
    const files = fs.readdirSync(reviewsDir).filter((f) => f.endsWith(".json"))
    for (const f of files) {
      const scored = scoreForRewrite(path.join(reviewsDir, f), "review")
      if (scored) all.push(scored)
    }
  }

  // Comparisons (top 100 only)
  const compsDir = path.join(CONTENT_DIR, "comparisons")
  if (fs.existsSync(compsDir)) {
    const files = fs.readdirSync(compsDir).filter((f) => f.endsWith(".json")).slice(0, 100)
    for (const f of files) {
      const scored = scoreForRewrite(path.join(compsDir, f), "comparison")
      if (scored) all.push(scored)
    }
  }

  // Guides
  const guidesDir = path.join(CONTENT_DIR, "guides")
  if (fs.existsSync(guidesDir)) {
    const files = fs.readdirSync(guidesDir).filter((f) => f.endsWith(".json"))
    for (const f of files) {
      const scored = scoreForRewrite(path.join(guidesDir, f), "guide")
      if (scored) all.push(scored)
    }
  }

  // Sort by potential
  all.sort((a, b) => b.potential - a.potential)

  // Top 20
  const top20 = all.slice(0, 20)

  // Generate markdown
  let md = `# Top 20 Pages to Rewrite\n\n`
  md += `Generated: ${new Date().toISOString()}\n\n`
  md += `These pages have the HIGHEST potential to rank if rewritten with original content, testing proof, and screenshots.\n\n`
  md += `**Priority: Rewrite these BEFORE publishing anything new.**\n\n---\n\n`

  top20.forEach((page, i) => {
    md += `## ${i + 1}. [${page.name}](${page.url})\n\n`
    md += `| Field | Value |\n|-------|-------|\n`
    md += `| **URL** | ${page.url} |\n`
    md += `| **Type** | ${page.type} |\n`
    md += `| **Category** | ${page.category} |\n`
    md += `| **Current word count** | ${page.words} |\n`
    md += `| **Target word count** | 3,000+ |\n`
    md += `| **Current sections** | ${page.sections} |\n`
    md += `| **Last reviewed** | ${page.lastReviewed} |\n`
    md += `| **Potential score** | ${page.potential}/100 |\n\n`
    md += `**Missing sections:**\n`
    page.missing.forEach((m) => { md += `- ${m}\n` })
    md += `\n**Suggested angle:** ${page.suggestedAngle}\n\n`
    md += `---\n\n`
  })

  fs.writeFileSync(OUTPUT_FILE, md)
  console.log(`✅ Top 20 written to ${OUTPUT_FILE}`)
  console.log(`\nTop 5 by potential:`)
  top20.slice(0, 5).forEach((p, i) => {
    console.log(`  ${i + 1}. ${p.name} (${p.type}) — Potential: ${p.potential}/100, Words: ${p.words}`)
  })
}

main()
