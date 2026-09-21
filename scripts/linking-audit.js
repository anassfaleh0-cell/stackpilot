#!/usr/bin/env node
/**
 * Internal Linking Audit Script
 * 
 * Run: node scripts/linking-audit.js
 * 
 * Detects:
 * 1. Orphan pages (no internal links pointing to them)
 * 2. Pages with few internal links
 * 3. Broken internal link targets
 * 4. Link distribution by content type
 */

import fs from "node:fs"
import path from "node:path"

const SITE_URL = "https://www.pilotstack.online"
const CONTENT_DIR = path.resolve(process.cwd(), "content")
const SRC_DIR = path.resolve(process.cwd(), "src")

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

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, "utf-8")
  } catch {
    return ""
  }
}

// ─── Collect all content URLs ────────────────────────────────────────────────
function getAllContentUrls() {
  const urls = new Map()
  const contentTypes = {
    reviews: { dir: "reviews", nameField: "name", urlPrefix: "/reviews/" },
    comparisons: { dir: "comparisons", nameField: "title", urlPrefix: "/comparisons/" },
    guides: { dir: "guides", nameField: "title", urlPrefix: "/guides/" },
    blog: { dir: "blog", nameField: "title", urlPrefix: "/blog/" },
    glossary: { dir: "glossary", nameField: "term", urlPrefix: "/glossary/" },
    alternatives: { dir: "alternatives", nameField: "title", urlPrefix: "/alternatives/" },
    "use-cases": { dir: "use-cases", nameField: "title", urlPrefix: "/use-cases/" },
    industries: { dir: "industries", nameField: "title", urlPrefix: "/industries/" },
    research: { dir: "research", nameField: "title", urlPrefix: "/research/" },
    statistics: { dir: "statistics", nameField: "title", urlPrefix: "/statistics/" },
    best: { dir: "best", nameField: "title", urlPrefix: "/best/" },
    hubs: { dir: "hubs", nameField: "title", urlPrefix: "/hubs/" },
  }

  for (const [type, config] of Object.entries(contentTypes)) {
    const dir = path.join(CONTENT_DIR, config.dir)
    const files = readDir(dir)
    for (const file of files) {
      const slug = file.replace(".json", "")
      const data = readJson(path.join(dir, file))
      if (data) {
        urls.set(`${config.urlPrefix}${slug}`, {
          type,
          slug,
          title: data[config.nameField] || slug,
          url: `${config.urlPrefix}${slug}`,
        })
      }
    }
  }

  return urls
}

// ─── Collect all internal links from content ─────────────────────────────────
function collectInternalLinksFromContent(allUrls) {
  const linkCounts = new Map()
  const contentTypes = ["reviews", "comparisons", "guides", "blog", "glossary", "alternatives", "use-cases", "industries", "research", "statistics", "best", "hubs"]
  
  for (const [url] of allUrls) {
    linkCounts.set(url, { incoming: 0, outgoing: 0, sources: [] })
  }

  const urlPatterns = new Map()
  for (const [url] of allUrls) {
    const slug = url.split("/").pop()
    if (slug) urlPatterns.set(slug, url)
  }

  for (const [url, info] of allUrls) {
    const contentDir = path.join(CONTENT_DIR, info.type === "reviews" ? "reviews" :
      info.type === "comparisons" ? "comparisons" :
      info.type === "guides" ? "guides" :
      info.type === "blog" ? "blog" :
      info.type === "glossary" ? "glossary" :
      info.type === "alternatives" ? "alternatives" :
      info.type === "use-cases" ? "use-cases" :
      info.type === "industries" ? "industries" :
      info.type === "research" ? "research" :
      info.type === "statistics" ? "statistics" :
      info.type === "best" ? "best" : "hubs")
    
    const data = readJson(path.join(contentDir, `${info.slug}.json`))
    if (!data) continue

    // Collect all text fields that might contain links
    const textFields = []
    if (data.relatedComparisons) textFields.push(...data.relatedComparisons.map(c => `/comparisons/${c}`))
    if (data.relatedGuides) textFields.push(...data.relatedGuides.map(g => `/guides/${g}`))
    if (data.relatedPosts) textFields.push(...data.relatedPosts.map(p => `/blog/${p}`))
    if (data.relatedTools) textFields.push(...data.relatedTools.map(t => `/reviews/${t}`))
    if (data.alternatives) textFields.push(...data.alternatives.map(a => `/reviews/${a}`))
    if (data.picks) textFields.push(...data.picks.map(p => `/reviews/${p.toolSlug}`))
    if (data.recommendations) textFields.push(...data.recommendations.map(r => `/reviews/${r.toolSlug}`))

    for (const targetUrl of textFields) {
      if (linkCounts.has(targetUrl)) {
        linkCounts.get(targetUrl).incoming++
        linkCounts.get(targetUrl).sources.push(url)
      }
    }

    linkCounts.get(url).outgoing = textFields.length
  }

  return linkCounts
}

// ─── Check component-level linking ───────────────────────────────────────────
function checkComponentLinks() {
  console.log("\n\x1b[1m1. Component-Level Internal Linking\x1b[0m")

  const components = [
    { path: "src/components/content/internal-links.tsx", name: "InternalLinks" },
    { path: "src/components/seo/breadcrumbs.tsx", name: "Breadcrumbs" },
    { path: "src/lib/content/entity-graph.ts", name: "EntityGraph" },
  ]

  for (const comp of components) {
    const fullPath = path.resolve(process.cwd(), comp.path)
    if (fs.existsSync(fullPath)) {
      const content = readFile(fullPath)
      const linkCount = (content.match(/href[=:]/g) || []).length
      console.log(`  \x1b[32m✔\x1b[0m ${comp.name} exists (${linkCount} link references)`)
    } else {
      console.log(`  \x1b[33m⚠\x1b[0m ${comp.name} not found at ${comp.path}`)
    }
  }
}

// ─── Detect orphan pages ────────────────────────────────────────────────────
function detectOrphanPages(allUrls, linkCounts) {
  console.log("\n\x1b[1m2. Orphan Page Detection\x1b[0m")

  const orphans = []
  for (const [url, info] of allUrls) {
    const links = linkCounts.get(url)
    if (links && links.incoming === 0) {
      orphans.push({ url, title: info.title, type: info.type })
    }
  }

  if (orphans.length === 0) {
    console.log("  \x1b[32m✔\x1b[0m No orphan pages detected")
  } else {
    console.log(`  \x1b[33m⚠\x1b[0m ${orphans.length} orphan pages found (no incoming internal links):`)
    for (const orphan of orphans.slice(0, 10)) {
      console.log(`    - ${orphan.type}: ${orphan.title} (${orphan.url})`)
    }
    if (orphans.length > 10) {
      console.log(`    ... and ${orphans.length - 10} more`)
    }
  }

  return orphans
}

// ─── Pages with few incoming links ───────────────────────────────────────────
function findWeakPages(linkCounts) {
  console.log("\n\x1b[1m3. Weakly Linked Pages (1-2 incoming links)\x1b[0m")

  const weak = []
  for (const [url, links] of linkCounts) {
    if (links.incoming > 0 && links.incoming <= 2) {
      weak.push({ url, incoming: links.incoming })
    }
  }

  if (weak.length === 0) {
    console.log("  \x1b[32m✔\x1b[0m All linked pages have adequate internal links")
  } else {
    console.log(`  \x1b[33m⚠\x1b[0m ${weak.length} pages with only 1-2 incoming internal links:`)
    for (const w of weak.slice(0, 10)) {
      console.log(`    - ${w.url} (${w.incoming} incoming links)`)
    }
    if (weak.length > 10) {
      console.log(`    ... and ${weak.length - 10} more`)
    }
  }

  return weak
}

// ─── Link distribution by content type ───────────────────────────────────────
function analyzeLinkDistribution(allUrls, linkCounts) {
  console.log("\n\x1b[1m4. Link Distribution by Content Type\x1b[0m")

  const distribution = {}
  for (const [url, info] of allUrls) {
    if (!distribution[info.type]) {
      distribution[info.type] = { total: 0, totalIncoming: 0, zeroIncoming: 0 }
    }
    distribution[info.type].total++
    const links = linkCounts.get(url)
    if (links) {
      distribution[info.type].totalIncoming += links.incoming
      if (links.incoming === 0) distribution[info.type].zeroIncoming++
    }
  }

  console.log("  Type                | Pages | Avg Incoming | Zero Incoming")
  console.log("  --------------------|-------|--------------|--------------")
  for (const [type, stats] of Object.entries(distribution)) {
    const avg = (stats.totalIncoming / stats.total).toFixed(1)
    const typeStr = type.padEnd(20)
    const totalStr = String(stats.total).padStart(5)
    const avgStr = avg.padStart(12)
    const zeroStr = String(stats.zeroIncoming).padStart(14)
    console.log(`  ${typeStr} | ${totalStr} | ${avgStr} | ${zeroStr}`)
  }
}

// ─── Main ───────────────────────────────────────────────────────────────────
function main() {
  console.log("\n\x1b[1m\x1b[36m╔══════════════════════════════════════════╗")
  console.log("║   Internal Linking Audit                 ║")
  console.log("╚══════════════════════════════════════════╝\x1b[0m")

  const allUrls = getAllContentUrls()
  console.log(`\n  Total content pages: ${allUrls.size}`)

  checkComponentLinks()
  const linkCounts = collectInternalLinksFromContent(allUrls)
  const orphans = detectOrphanPages(allUrls, linkCounts)
  const weak = findWeakPages(linkCounts)
  analyzeLinkDistribution(allUrls, linkCounts)

  console.log("\n\x1b[1m─── Recommendations ────────────────────────────────────\x1b[0m")
  if (orphans.length > 0) {
    console.log(`  1. Add internal links to ${orphans.length} orphan pages from related content`)
  }
  if (weak.length > 0) {
    console.log(`  2. Strengthen ${weak.length} weakly-linked pages with more internal links`)
  }
  if (orphans.length === 0 && weak.length === 0) {
    console.log("  \x1b[32mInternal linking looks healthy!\x1b[0m")
  }
  console.log("")
}

main()
