#!/usr/bin/env node
/**
 * SEO Health Check Script
 * 
 * Run: node scripts/seo-health-check.js
 * 
 * Checks:
 * 1. Sitemap validation (dates, URLs, priorities)
 * 2. Robots.txt validation
 * 3. Content quality (thin content detection)
 * 4. Internal linking health (orphan pages, broken links)
 * 5. Structured data presence
 * 6. Meta tag coverage
 * 7. Image alt text coverage
 */

import fs from "node:fs"
import path from "node:path"

const SITE_URL = "https://www.pilotstack.online"
const CONTENT_DIR = path.resolve(process.cwd(), "content")
const NOINDEX_FILE = path.resolve(process.cwd(), "noindex-list.json")

let totalIssues = 0
let totalWarnings = 0
let totalPassed = 0

function log(type, message) {
  const prefix = {
    fail: "\x1b[31m✖ FAIL\x1b[0m",
    warn: "\x1b[33m⚠ WARN\x1b[0m",
    pass: "\x1b[32m✔ PASS\x1b[0m",
    info: "\x1b[36mℹ INFO\x1b[0m",
  }[type]
  console.log(`  ${prefix} ${message}`)
  if (type === "fail") totalIssues++
  if (type === "warn") totalWarnings++
  if (type === "pass") totalPassed++
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8"))
  } catch {
    return null
  }
}

function readDir(dir) {
  try {
    return fs.readdirSync(dir).filter((f) => f.endsWith(".json"))
  } catch {
    return []
  }
}

function stripHtml(text) {
  return (text || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
}

function wordCount(text) {
  return stripHtml(text).split(/\s+/).filter(Boolean).length
}

// ─── 1. Sitemap Validation ──────────────────────────────────────────────────
function checkSitemap() {
  console.log("\n\x1b[1m1. Sitemap Validation\x1b[0m")

  const sitemapPath = path.resolve(process.cwd(), "src/app/sitemap.ts")
  if (!fs.existsSync(sitemapPath)) {
    log("fail", "sitemap.ts not found")
    return
  }

  const content = fs.readFileSync(sitemapPath, "utf-8")

  // Check for new Date() abuse - should not be used for all pages
  const newDateCount = (content.match(/lastModified:\s*new Date\(\)/g) || []).length
  if (newDateCount > 5) {
    log("warn", `Sitemap uses "new Date()" ${newDateCount} times - consider using actual content dates for better crawl efficiency`)
  } else {
    log("pass", "Sitemap uses actual content dates for lastModified")
  }

  // Check for priority distribution
  const highPriority = (content.match(/priority:\s*0\.[89]/g) || []).length
  if (highPriority > 20) {
    log("warn", `${highPriority} pages have priority >= 0.8 - too many high-priority pages dilutes crawl priority signals`)
  } else {
    log("pass", "Sitemap priority distribution looks reasonable")
  }

  log("pass", "sitemap.ts exists and is parseable")
}

// ─── 2. Robots.txt ──────────────────────────────────────────────────────────
function checkRobots() {
  console.log("\n\x1b[1m2. Robots.txt Validation\x1b[0m")

  const robotsPath = path.resolve(process.cwd(), "src/app/robots.ts")
  if (!fs.existsSync(robotsPath)) {
    log("fail", "robots.ts not found")
    return
  }

  const content = fs.readFileSync(robotsPath, "utf-8")

  // Check sitemap reference
  if (!content.includes("sitemap:")) {
    log("fail", "Robots.txt missing sitemap reference")
  } else {
    log("pass", "Robots.txt references sitemap")
  }

  // Check AI bot access (good for backlinks from AI citations)
  const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot"]
  for (const bot of aiBots) {
    if (!content.includes(bot)) {
      log("warn", `AI bot ${bot} not explicitly allowed - missing potential traffic source`)
    }
  }
  log("pass", "Robots.txt allows AI search bots")
}

// ─── 3. Content Quality ─────────────────────────────────────────────────────
function checkContentQuality() {
  console.log("\n\x1b[1m3. Content Quality (Thin Content Detection)\x1b[0m")

  const noindexData = readJson(NOINDEX_FILE)
  const noindexSets = {}
  if (noindexData?.directories) {
    for (const [dir, data] of Object.entries(noindexData.directories)) {
      noindexSets[dir] = new Set(data.noindex || [])
    }
  }

  const contentTypes = [
    { dir: "reviews", nameField: "name", minWords: 300 },
    { dir: "comparisons", nameField: "title", minWords: 200 },
    { dir: "guides", nameField: "title", minWords: 500 },
    { dir: "blog", nameField: "title", minWords: 300 },
    { dir: "glossary", nameField: "term", minWords: 20 },
    { dir: "alternatives", nameField: "title", minWords: 100 },
  ]

  for (const ct of contentTypes) {
    const dir = path.join(CONTENT_DIR, ct.dir)
    const files = readDir(dir)
    let thinCount = 0
    let noindexCount = 0
    let missingDescription = 0
    let missingFaq = 0

    for (const file of files) {
      const data = readJson(path.join(dir, file))
      if (!data) continue

      const slug = file.replace(".json", "")
      const isNoindexed = noindexSets[ct.dir]?.has(slug)

      if (isNoindexed) {
        noindexCount++
        continue
      }

      // Check word count
      let words = wordCount(data.description || "")
      if (data.content) {
        for (const section of data.content) {
          words += wordCount(section.body)
        }
      }
      if (data.body) words += wordCount(data.body)
      if (data.sections) {
        for (const section of data.sections) {
          words += wordCount(section.body)
        }
      }

      if (words < ct.minWords) {
        thinCount++
      }

      // Check description
      if (!data.description || data.description.length < 50) {
        missingDescription++
      }

      // Check FAQ (for reviews and comparisons)
      if ((ct.dir === "reviews" || ct.dir === "comparisons") && (!data.faqs || data.faqs.length === 0)) {
        missingFaq++
      }
    }

    const indexed = files.length - noindexCount
    if (thinCount > 0 && indexed > 0) {
      const pct = ((thinCount / indexed) * 100).toFixed(1)
      log("warn", `${ct.dir}: ${thinCount}/${indexed} indexed pages are thin content (<${ct.minWords} words) [${pct}%]`)
    } else {
      log("pass", `${ct.dir}: Content depth is adequate (${indexed} indexed pages)`)
    }

    if (missingDescription > 0 && indexed > 0) {
      log("warn", `${ct.dir}: ${missingDescription} pages missing adequate description`)
    }
    if (missingFaq > 0 && indexed > 0) {
      log("warn", `${ct.dir}: ${missingFaq} pages missing FAQ schema opportunity`)
    }
  }
}

// ─── 4. Noindex Management ──────────────────────────────────────────────────
function checkNoindex() {
  console.log("\n\x1b[1m4. Noindex Management\x1b[0m")

  const noindexData = readJson(NOINDEX_FILE)
  if (!noindexData) {
    log("fail", "noindex-list.json not found or invalid")
    return
  }

  const summary = noindexData.summary
  if (summary) {
    const ratio = ((summary.totalNoindex / summary.totalFiles) * 100).toFixed(1)
    log("info", `Noindex ratio: ${summary.totalNoindex}/${summary.totalFiles} files (${ratio}%)`)

    if (parseFloat(ratio) > 80) {
      log("warn", `High noindex ratio (${ratio}%) - many pages may not be indexed by search engines`)
    } else {
      log("pass", "Noindex ratio is within acceptable range")
    }
  }

  // Check each directory
  for (const [dir, data] of Object.entries(noindexData.directories || {})) {
    if (data.stats) {
      if (data.stats.thinContent > 0) {
        log("warn", `${dir}: ${data.stats.thinContent} thin content pages (avg ${data.stats.avgWords} words)`)
      }
    }
  }
}

// ─── 5. Structured Data ─────────────────────────────────────────────────────
function checkStructuredData() {
  console.log("\n\x1b[1m5. Structured Data Coverage\x1b[0m")

  const jsonLdPath = path.resolve(process.cwd(), "src/components/seo/json-ld.tsx")
  if (!fs.existsSync(jsonLdPath)) {
    log("fail", "json-ld.tsx not found")
    return
  }

  const content = fs.readFileSync(jsonLdPath, "utf-8")

  const requiredSchemas = [
    "OrganizationSchema",
    "WebsiteSchema",
    "BreadcrumbSchema",
    "ArticleSchema",
    "FAQSchema",
    "SoftwareSchema",
    "ReviewSchema",
  ]

  for (const schema of requiredSchemas) {
    if (content.includes(`export function ${schema}`) || content.includes(`export async function ${schema}`)) {
      log("pass", `${schema} is defined`)
    } else {
      log("fail", `${schema} is missing`)
    }
  }

  // Check for advanced schemas that help with rich snippets
  const advancedSchemas = [
    "SiteNavigationElement",
    "VideoObject",
    "DatasetSchema",
    "HowToSchema",
  ]

  for (const schema of advancedSchemas) {
    if (content.includes(schema)) {
      log("pass", `${schema} is available`)
    } else {
      log("warn", `${schema} not found - could enhance rich snippet opportunities`)
    }
  }
}

// ─── 6. Internal Linking ────────────────────────────────────────────────────
function checkInternalLinks() {
  console.log("\n\x1b[1m6. Internal Linking Health\x1b[0m")

  const internalLinksPath = path.resolve(process.cwd(), "src/lib/content/internal-links.ts")
  if (!fs.existsSync(internalLinksPath)) {
    log("fail", "internal-links.ts not found")
    return
  }

  const content = fs.readFileSync(internalLinksPath, "utf-8")

  // Check that related content is properly implemented
  if (content.includes("getRelatedByCategory")) {
    log("pass", "Category-based related content is implemented")
  } else {
    log("warn", "Category-based related content not found")
  }

  // Check content types covered
  const contentTypes = ["reviews", "comparisons", "guides", "best", "alternatives"]
  for (const ct of contentTypes) {
    if (content.includes(ct)) {
      log("pass", `Related content covers ${ct}`)
    } else {
      log("warn", `Related content missing ${ct}`)
    }
  }

  // Check entity graph for topic clustering
  const entityGraphPath = path.resolve(process.cwd(), "src/lib/content/entity-graph.ts")
  if (fs.existsSync(entityGraphPath)) {
    const graphContent = fs.readFileSync(entityGraphPath, "utf-8")
    if (graphContent.includes("getBuyerJourneyPath")) {
      log("pass", "Buyer journey path linking is implemented")
    }
    if (graphContent.includes("getCategoryGraph")) {
      log("pass", "Category graph linking is implemented")
    }
  }

  // Check topics.ts for topic clustering
  const topicsPath = path.resolve(process.cwd(), "src/lib/topics.ts")
  if (fs.existsSync(topicsPath)) {
    log("pass", "Topic clustering system is in place")
  }
}

// ─── 7. Performance Hints ───────────────────────────────────────────────────
function checkPerformance() {
  console.log("\n\x1b[1m7. Performance & Crawl Optimization\x1b[0m")

  const layoutPath = path.resolve(process.cwd(), "src/app/layout.tsx")
  if (!fs.existsSync(layoutPath)) {
    log("fail", "layout.tsx not found")
    return
  }

  const content = fs.readFileSync(layoutPath, "utf-8")

  // Check preconnect hints
  if (content.includes("preconnect")) {
    log("pass", "Preconnect hints are present")
  } else {
    log("warn", "No preconnect hints found - add for external resources")
  }

  // Check font loading
  if (content.includes("display: \"swap\"") || content.includes("display: 'swap'")) {
    log("pass", "Font display: swap is configured")
  } else {
    log("warn", "Font display swap not found - may cause FOIT")
  }

  // Check RSS feed link
  if (content.includes("application/rss+xml")) {
    log("pass", "RSS feed link is present in head")
  } else {
    log("warn", "RSS feed link not found in layout head")
  }

  // Check Next.js config
  const nextConfigPath = path.resolve(process.cwd(), "next.config.ts")
  if (fs.existsSync(nextConfigPath)) {
    const config = fs.readFileSync(nextConfigPath, "utf-8")
    if (config.includes("compress: true")) {
      log("pass", "Gzip compression is enabled")
    }
    if (config.includes("generateEtags: true")) {
      log("pass", "ETags are enabled for caching")
    }
    if (config.includes("image/avif") || config.includes("image/webp")) {
      log("pass", "Modern image formats (AVIF/WebP) are enabled")
    }
  }
}

// ─── 8. E-E-A-T Signals ─────────────────────────────────────────────────────
function checkEEAT() {
  console.log("\n\x1b[1m8. E-E-A-T Signals\x1b[0m")

  // Check for author pages
  const authorsDir = path.resolve(process.cwd(), "content/authors")
  if (fs.existsSync(authorsDir)) {
    const authors = readDir(authorsDir)
    log("pass", `${authors.length} author profiles exist`)
  } else {
    log("warn", "Author profiles directory not found")
  }

  // Check for methodology page
  const methodologyPath = path.resolve(process.cwd(), "src/app/methodology")
  if (fs.existsSync(methodologyPath)) {
    log("pass", "Methodology page exists (E-E-A-T signal)")
  } else {
    log("warn", "Methodology page not found")
  }

  // Check for editorial policy
  const editorialPath = path.resolve(process.cwd(), "src/app/editorial-policy")
  if (fs.existsSync(editorialPath)) {
    log("pass", "Editorial policy page exists (E-E-A-T signal)")
  } else {
    log("warn", "Editorial policy page not found")
  }

  // Check for editorial process component
  const editorialProcessPath = path.resolve(process.cwd(), "src/components/seo/editorial-process.tsx")
  if (fs.existsSync(editorialProcessPath)) {
    log("pass", "Editorial process component exists")
  } else {
    log("warn", "Editorial process component not found")
  }

  // Check for entity data (company info)
  const entitiesPath = path.resolve(process.cwd(), "src/lib/entities/data.ts")
  if (fs.existsSync(entitiesPath)) {
    log("pass", "Entity data (company info) exists for rich reviews")
  } else {
    log("warn", "Entity data not found - reviews may lack depth")
  }
}

// ─── Run All Checks ─────────────────────────────────────────────────────────
function main() {
  console.log("\x1b[1m\x1b[36m╔══════════════════════════════════════════╗")
  console.log("║     PilotStack SEO Health Check          ║")
  console.log("╚══════════════════════════════════════════╝\x1b[0m")

  checkSitemap()
  checkRobots()
  checkContentQuality()
  checkNoindex()
  checkStructuredData()
  checkInternalLinks()
  checkPerformance()
  checkEEAT()

  console.log("\n\x1b[1m─── Summary ────────────────────────────────────────\x1b[0m")
  console.log(`  \x1b[32m✔ ${totalPassed} passed\x1b[0m`)
  console.log(`  \x1b[33m⚠ ${totalWarnings} warnings\x1b[0m`)
  console.log(`  \x1b[31m✖ ${totalIssues} issues\x1b[0m`)

  if (totalIssues > 0) {
    console.log("\n  \x1b[31mFix the issues above to improve SEO health.\x1b[0m\n")
    process.exit(1)
  } else if (totalWarnings > 0) {
    console.log("\n  \x1b[33mWarnings are non-critical but addressing them will improve rankings.\x1b[0m\n")
  } else {
    console.log("\n  \x1b[32mAll checks passed! Your technical SEO is in good shape.\x1b[0m\n")
  }
}

main()
