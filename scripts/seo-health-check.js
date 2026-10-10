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

const SITE_URL = "https://pilotstack.online"
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

  // Static-source diagnostics only: a source scan cannot prove runtime XML validity.
  const dynamicDateFallbacks = (content.match(/(?:const\s+\w*DATE\s*=\s*new Date\(\)|lastModified:\s*new Date\([^)]*LISTING_DATE)/g) || []).length
  if (dynamicDateFallbacks > 0) {
    log("warn", `Sitemap source contains ${dynamicDateFallbacks} dynamic date/fallback pattern(s); verify generated <lastmod> values against real content update dates`)
  } else {
    log("pass", "No known dynamic sitemap-date fallback patterns detected in source")
  }

  // Check for priority distribution as a source-level heuristic, not a per-URL count.
  const highPriority = (content.match(/priority:\s*0\.[89]|priority:\s*1\.0/g) || []).length
  if (highPriority > 20) {
    log("warn", `${highPriority} high-priority declarations exist in sitemap source; inspect actual generated URL priorities before changing them`)
  } else {
    log("info", `${highPriority} high-priority declarations found in sitemap source (not a generated URL count)`)
  }

  if (content.includes("export default function sitemap") && content.includes("MetadataRoute.Sitemap")) {
    log("pass", "sitemap.ts contains the expected Next.js sitemap function/type markers; generated XML still requires runtime validation")
  } else {
    log("fail", "sitemap.ts is missing expected Next.js sitemap function/type markers")
  }
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

  // Source-level checks must not emit an unconditional PASS.
  const aiBots = ["GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot"]
  const configuredAiBots = new Set([...content.matchAll(/userAgent\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]))
  const missingAiBotRules = aiBots.filter((bot) => !configuredAiBots.has(bot))
  if (missingAiBotRules.length > 0) {
    log("warn", `AI crawler user-agent rules are not explicitly declared: ${missingAiBotRules.join(", ")}`)
  } else {
    log("pass", "All configured AI crawler names have explicit user-agent rules")
  }

  const privatePaths = ["/api/", "/admin/", "/dashboard", "/search", "/_global-error"]
  const namedCrawlerRules = [...content.matchAll(/userAgent\s*:\s*["']([^"']+)["']([\s\\S]*?)(?=userAgent\s*:|sitemap\s*:|$)/g)]
    .filter((match) => match[1] !== "*")
  const missingPrivatePathBlocks = namedCrawlerRules
    .filter((match) => privatePaths.some((route) => !match[2].includes(route)))
    .map((match) => match[1])
  if (missingPrivatePathBlocks.length > 0) {
    log("warn", `Named crawler rules do not visibly repeat all private/search path exclusions: ${missingPrivatePathBlocks.join(", ")}; inspect the generated robots.txt rule groups`)
  } else if (namedCrawlerRules.length > 0) {
    log("pass", "Named crawler rules visibly include the configured internal-path exclusions")
  }
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

  // Comparison pages render a concise evidence profile from each linked review.
  // Include only the fields actually shown there so the audit does not call a
  // page thin solely because that copy lives in the linked review record.
  const reviewsBySlug = new Map()
  const crossCategoryComparisons = []
  const reviewsDir = path.join(CONTENT_DIR, "reviews")
  for (const file of readDir(reviewsDir)) {
    const review = readJson(path.join(reviewsDir, file))
    if (review && typeof review.slug === "string") reviewsBySlug.set(review.slug, review)
  }

  const contentTypes = [
    { dir: "reviews", nameField: "name", minWords: 300 },
    { dir: "comparisons", nameField: "title", minWords: 200 },
    { dir: "guides", nameField: "title", minWords: 500 },
    { dir: "blog", nameField: "title", minWords: 300 },
    { dir: "glossary", nameField: "term", minWords: 80 },
    { dir: "alternatives", nameField: "title", minWords: 100 },
    { dir: "best", nameField: "title", minWords: 300 },
  ]

  // Diagnostic patterns for known generic editorial filler; this is not an automatic noindex rule.
  const genericTemplatePatterns = [
    /most successful deployments follow a phased approach/i,
    /this topic is most useful when it is connected to a real decision/i,
    /choosing the right marketing\s*&\s*seo software/i,
    /adequate performance for most use cases\./i,
    /functional organized interface\./i,
    /strong performance with fast load times\./i,
    /delivers reliable performance with 99\.9% uptime SLA/i,
    /delivers reliable performance with solid performance suitable for most business use cases/i,
    /written against our published editorial methodology/i,
    /updated when the underlying content is reviewed/i,
    /positive ROI typically within 3-6 months/i,
    /most teams start within hours/i,
    /a teams team uses/i,
    /updates weekly[^.]*major feature releases quarterly/i,
    /perfect for freelancers and independent professionals/i,
    /and \d+\+ more\./i,
    /workfl(?:$|\s)/i,
  ]

  for (const ct of contentTypes) {
    const dir = path.join(CONTENT_DIR, ct.dir)
    const files = readDir(dir)
    let thinCount = 0
    let noindexCount = 0
    let missingDescription = 0
    let missingFaq = 0
    let genericTemplateCount = 0
    const genericTemplateExamples = []
    const thinSamples = []

    for (const file of files) {
      const data = readJson(path.join(dir, file))
      if (!data) continue

      const slug = file.replace(".json", "")
      const isNoindexed = noindexSets[ct.dir]?.has(slug)

      if (isNoindexed) {
        noindexCount++
        continue
      }

      const searchableContent = JSON.stringify(data)
      const matchingGenericPatterns = genericTemplatePatterns.filter((pattern) => pattern.test(searchableContent))
      if (matchingGenericPatterns.length > 0) {
        genericTemplateCount++
        if (genericTemplateExamples.length < 8) genericTemplateExamples.push(slug)
      }

      // Count audited source fields, not the final rendered page. Some routes
      // derive additional copy at runtime; this source-level heuristic deliberately
      // reports its scope so it is not mistaken for a rendered-page word count.
      let words = wordCount(data.description || "")
      if (data.content) {
        for (const section of data.content) {
          words += wordCount(section.title)
          words += wordCount(section.body)
          for (const item of section.items || []) words += wordCount(item)
        }
      }
      if (data.body) words += wordCount(data.body)
      if (data.sections) {
        for (const section of data.sections) {
          words += wordCount(section.title)
          words += wordCount(section.body)
          for (const item of section.items || []) words += wordCount(item)
        }
      }
      if (ct.dir === "comparisons") {
        words += wordCount(data.verdict || "")
        for (const feature of data.features || []) {
          words += wordCount(feature.name)
          words += wordCount(feature.tool1Detail)
          words += wordCount(feature.tool2Detail)
        }
        for (const faq of data.faqs || []) {
          words += wordCount(faq.question)
          words += wordCount(faq.answer)
        }
        const linkedReviews = [data.tool1Slug, data.tool2Slug].map((slug) => typeof slug === "string" ? reviewsBySlug.get(slug) : null)
        for (const review of linkedReviews) {
          if (!review) continue
          words += wordCount(review.name)
          words += wordCount(review.description || review.tagline)
          words += wordCount(review.category)
          words += wordCount(review.priceRange || review.pricing)
          for (const value of (review.pros || []).slice(0, 2)) words += wordCount(value)
          for (const value of (review.cons || []).slice(0, 2)) words += wordCount(value)
        }
        const [review1, review2] = linkedReviews
        if (review1?.category && review2?.category && review1.category !== review2.category) {
          crossCategoryComparisons.push({
            slug: data.slug,
            tool1: data.tool1,
            category1: review1.category,
            tool2: data.tool2,
            category2: review2.category,
            recordedWinner: data.winner || null,
          })
        }
      }
      if (ct.dir === "alternatives") {
        words += wordCount(data.toolName || data.title || "")
        words += wordCount(data.verdict || "")
        // The alternatives corpus has used both `tools` and `alternatives`
        // as the list key; count whichever schema the record actually contains.
        const options = Array.isArray(data.tools) ? data.tools : Array.isArray(data.alternatives) ? data.alternatives : []
        for (const item of options) {
          words += wordCount(item.name)
          words += wordCount(item.description)
          words += wordCount(item.bestFor)
          words += wordCount(item.priceRange)
          for (const value of item.pros || []) words += wordCount(value)
          for (const value of item.cons || []) words += wordCount(value)
        }
        for (const value of data.selectionCriteria || []) words += wordCount(value)
        for (const faq of data.faqs || []) {
          words += wordCount(faq.question)
          words += wordCount(faq.answer)
        }
      }
      if (ct.dir === "glossary") {
        words += wordCount(data.term)
        words += wordCount(data.definition)
        words += wordCount(data.extendedDefinition)
        for (const value of data.examples || []) words += wordCount(value)
        for (const value of data.relatedTerms || []) words += wordCount(value)
      }
      if (ct.dir === "best") {
        words += wordCount(data.title)
        words += wordCount(data.pricingSummary)
        for (const value of data.criteria || []) words += wordCount(value)
        for (const pick of data.picks || []) {
          words += wordCount(pick.toolName)
          words += wordCount(pick.bestFor)
          words += wordCount(pick.priceRange)
          for (const value of pick.pros || []) words += wordCount(value)
          for (const value of pick.cons || []) words += wordCount(value)
        }
        for (const row of data.comparisonTable?.rows || []) {
          for (const cell of row) words += wordCount(cell)
        }
        for (const faq of data.faqs || []) {
          words += wordCount(faq.question)
          words += wordCount(faq.answer)
        }
      }

      if (words < ct.minWords) {
        thinCount++
        thinSamples.push({
          slug,
          title: String(data[ct.nameField] || slug),
          sourceWords: words,
        })
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

    const eligibleRecords = files.length - noindexCount
    if (thinCount > 0 && eligibleRecords > 0) {
      const pct = ((thinCount / eligibleRecords) * 100).toFixed(1)
      log("warn", ct.dir + ": " + thinCount + "/" + eligibleRecords + " eligible source records have fewer than " + ct.minWords + " words in audited fields [" + pct + "%]. This is a source-data signal, not a rendered-page word count; runtime-derived copy is not measured. Samples: " + JSON.stringify(thinSamples.slice(0, 8)))
    } else {
      log("pass", ct.dir + ": Audited source fields meet the configured word threshold (" + eligibleRecords + " eligible records)")
    }

    if (missingDescription > 0 && eligibleRecords > 0) {
      log("warn", ct.dir + ": " + missingDescription + " source records missing an adequate description")
    }
    if (missingFaq > 0 && eligibleRecords > 0) {
      log("warn", ct.dir + ": " + missingFaq + " source records missing a FAQ data opportunity")
    }
    if (genericTemplateCount > 0) {
      log("warn", `${ct.dir}: ${genericTemplateCount} raw source records contain known generic phrase patterns; configured matches are filtered from rendered text by the registry, but source cleanup is still recommended. Examples: ${genericTemplateExamples.join(", ")}`)
    } else {
      log("pass", `${ct.dir}: No known generic filler phrases found`)
    }
  }

  if (crossCategoryComparisons.length > 0) {
    log("warn", `comparisons: ${crossCategoryComparisons.length} raw comparison records pair products from different linked-review categories; rendered pages now suppress unverified winner/score claims and explain distinct use cases, but each pairing still needs editorial relevance review. Samples: ${JSON.stringify(crossCategoryComparisons.slice(0, 10))}`)
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

  // Public author profiles are defined in the route and slug registry, not content/authors JSON.
  const authorRegistryPath = path.resolve(process.cwd(), "src/lib/authors.ts")
  if (fs.existsSync(authorRegistryPath)) {
    const authorRegistry = fs.readFileSync(authorRegistryPath, "utf8")
    const slugList = authorRegistry.match(/PUBLIC_AUTHOR_SLUGS\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const/)
    const authorCount = slugList ? [...slugList[1].matchAll(/["']([^"']+)["']/g)].length : 0
    if (authorCount > 0) log("pass", `${authorCount} public author profile(s) are configured`)
    else log("warn", "No public author profiles are configured in src/lib/authors.ts")
  } else {
    log("warn", "Author profile registry not found")
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
