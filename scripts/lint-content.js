const fs = require("fs")
const path = require("path")

const CONTENT_DIRS = ["content/guides", "content/comparisons", "content/reviews", "content/best", "content/blog"]
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

const DOLLAR_RE = /\$[\d,]+\.?\d*(?:\/\w+)?/g

const TOOL_NAMES = {
  figma: "figma", canva: "canva", sketch: "sketch", framer: "framer",
  webflow: "webflow", invision: "invision", miro: "miro",
  gitlab: "gitlab", github: "github", docker: "docker",
  circleci: "circleci", jenkins: "jenkins",
  jira: "jira", asana: "asana", notion: "notion", "monday": "monday-com",
  clickup: "clickup", trello: "trello", basecamp: "basecamp",
  linear: "linear", shortcut: "shortcut",
  salesforce: "salesforce", hubspot: "hubspot",
  chatgpt: "chatgpt", jasper: "jasper", claude: "claude", gemini: "gemini",
  midjourney: "midjourney", vercel: "vercel", stripe: "stripe",
  slack: "slack", zoom: "zoom"
}

function collectText(value) {
  if (typeof value === "string") return value
  if (Array.isArray(value)) return value.map(collectText).join(" ")
  if (value && typeof value === "object") return Object.values(value).map(collectText).join(" ")
  return ""
}

function getVerifiedEntities() {
  const verified = new Set()
  const dataPath = path.join(__dirname, "..", "src", "lib", "entities", "data.ts")
  const expPath = path.join(__dirname, "..", "src", "lib", "entities", "expansion.ts")
  for (const fp of [dataPath, expPath]) {
    if (!fs.existsSync(fp)) continue
    const content = fs.readFileSync(fp, "utf-8")
    const lines = content.split("\n")
    lines.forEach((line, i) => {
      if (line.includes("pricingVerifiedDate")) {
        const dateMatch = line.match(/['"](\d{4}-\d{2}-\d{2})['"]/)
        if (dateMatch) {
          const d = new Date(dateMatch[1])
          const now = new Date()
          const daysDiff = (now - d) / (1000 * 60 * 60 * 24)
          if (daysDiff <= 90) {
            for (let j = i; j >= Math.max(0, i - 80); j--) {
              const slugMatch = lines[j].match(/slug:\s*['"]([^'"]+)['"]/)
              if (slugMatch) {
                verified.add(slugMatch[1])
                break
              }
            }
          }
        }
      }
    })
  }
  return verified
}

function checkPricingFigures(body, file, verifiedEntities) {
  const warnings = []
  let match
  DOLLAR_RE.lastIndex = 0
  while ((match = DOLLAR_RE.exec(body)) !== null) {
    const pos = match.index
    const windowStart = Math.max(0, pos - 150)
    const windowEnd = Math.min(body.length, pos + 150)
    const context = body.slice(windowStart, windowEnd).toLowerCase()
    // Dollar amounts in SaaS metrics (ARR, CAC, retention examples) are not vendor prices.
    // Only flag amounts when the surrounding text indicates a pricing/plan/billing claim.
    const pricingContext = /\\b(pricing|price|subscription|billing|plan|tier|fee|overage|per (?:user|editor|seat)|paid plan|monthly plan|annual plan)\\b/i.test(context)
    if (!pricingContext) continue
    for (const [name, slug] of Object.entries(TOOL_NAMES)) {
      if (context.includes(name) && !verifiedEntities.has(slug)) {
        warnings.push("Unverified $ figure near \"" + name + "\": " + match[0])
        break
      }
    }
  }
  return warnings
}

function stripPunct(w) {
  return w.replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
}

function checkTitleDuplicates(title, file) {
  const words = title.split(/\s+/)
  for (let i = 0; i < words.length - 1; i++) {
    const a = stripPunct(words[i])
    const b = stripPunct(words[i + 1])
    if (a && a === b) {
      console.error(`  ERROR: Duplicate word "${words[i]} ${words[i+1]}" in title`)
      return true
    }
  }
  return false
}

function checkDateFormats(data, file) {
  let errs = 0
  for (const field of ["lastUpdated", "publishedAt", "updatedAt", "lastReviewed"]) {
    if (!data[field]) continue
    const value = String(data[field])
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) continue
    const parsed = new Date(value)
    if (Number.isNaN(parsed.getTime())) {
      console.error(`  ERROR: Invalid date "${field}": "${value}"`)
      errs++
    } else {
      console.warn(`  WARNING: Non-ISO date "${field}" normalized by content registry: "${value}"`)
    }
  }
  return errs
}

const dirs = ["content/guides", "content/comparisons", "content/reviews", "content/best", "content/blog", "content/glossary", "content/alternatives", "content/use-cases", "content/industries", "content/research", "content/statistics", "content/hubs"]
let totalErrors = 0
const verifiedEntities = getVerifiedEntities()
const boilerplatePatterns = [
  /enterprise deployments consistently demonstrate/gi,
  /this approach enables teams to maximize their software investment/gi,
  /<brand>.*<\/brand>/gi,
  /<objection>.*<\/objection>/gi,
  /organizations see measurable improvements in efficiency and user satisfaction within the first quarter/gi,
  /organizations see measurable improvements in efficiency and team productivity/gi,
  /our methodology combines hands-on product testing/gi,
  /case study [123] - (?:aerospace|healthcare|finance)/gi,
  /response times: sub-second p50/gi,
  /break-even typically 3-6 months/gi,
  /first-year roi of 150-300%/gi,
  /1000\+ pre-built connectors/gi,
  /week 1: discovery, planning, requirements gathering/gi,
  /weighted criteria: features 25%, ease of use 20%/gi,
  /cloud-native deployment on aws\/gcp\/azure/gi,
  /regular product updates/gi,
  /strong customer support/gi,
  /good mobile experience/gi,
  /active user community/gi,
]

const unsupportedClaimPatterns = [
  /hands[- ]on testing/gi,
  /tested for at least two weeks/gi,
  /based on our testing methodology/gi,
  /this review is based on hands[- ]on testing/gi,
  /we verify our hands[- ]on testing/gi,
  /tested in realistic workflows by our team/gi,
  /our expert team evaluated/gi,
  /our testing methodology/gi,
  /after researching hundreds of/gi,
  /our expert buying advice/gi,
  /hands[- ]on review/gi,
  /we tested \d+\+?/gi,
  /tested \d+\+? (?:software )?tools/gi,
  /approximately \d+[-–]\d+ tools annually/gi,
  /every week we receive emails/gi,
  /after working in (?:product management|operations)/gi,
  /hi, i(?:'|&apos;)m [^,]+, the founder/gi,
  /independently evaluated and would recommend/gi,
  /evaluated under the same conditions as/gi,
]
function describeMatches(raw, pattern) {
  pattern.lastIndex = 0
  return (raw.match(pattern) || []).slice(0, 3).map((match) => match.slice(0, 180))
}

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"))
  for (const file of files) {
    const fpath = path.join(dir, file)
    const data = JSON.parse(fs.readFileSync(fpath, "utf-8"))
    const title = data.title || data.term || data.name || ""
    const slug = file.replace(".json", "")
    const dirName = dir.replace("content/", "")
    const isNoindexed = false
    const isKept = true
    let fileErrors = 0

    // Lint the actual source payload; runtime sanitization must never hide source defects.
    const raw = JSON.stringify(data)
    const validationData = data
    const validationRaw = raw
    const malformedLinks = (raw.match(/<a href="[^"]*">\s*<a href=/gi) || []).length
    if (malformedLinks > 0) {
      console.error("  ERROR: " + malformedLinks + " malformed nested <a> link pattern(s)")
      fileErrors += malformedLinks
    }

    for (const pattern of boilerplatePatterns) {
      pattern.lastIndex = 0
      const hits = validationRaw.match(pattern) || []
      if (hits.length > 0) {
        console.error("  ERROR: Unsupported/generated-content marker appears " + hits.length + " time(s): " + describeMatches(validationRaw, pattern).map((m) => JSON.stringify(m)).join(" | "))
        fileErrors += hits.length
      }
    }

    if (checkTitleDuplicates(title, file)) fileErrors++
    fileErrors += checkDateFormats(data, file)

    for (const pattern of unsupportedClaimPatterns) {
      pattern.lastIndex = 0
      const hits = validationRaw.match(pattern) || []
      if (hits.length > 0) {
        console.error("  ERROR: Unsupported claim appears " + hits.length + " time(s): " + describeMatches(validationRaw, pattern).map((m) => JSON.stringify(m)).join(" | "))
        fileErrors += hits.length
      }
    }

    const placeholders =
      (raw.match(/\b(?:TODO|TBD)\b/g) || []).length +
      (raw.match(/\b(?:replace me|example text|coming soon)\b/gi) || []).length
    if (placeholders > 0) {
      console.error("  ERROR: Placeholder content marker appears " + placeholders + " time(s)")
      fileErrors += placeholders
    }

    if (!String(title).trim()) {
      console.error("  ERROR: Missing title/term")
      fileErrors++
    }

    const primaryText = collectText(data).trim()
    if (primaryText.length < 120 && !["content/glossary", "content/statistics"].includes(dir)) {
      console.error("  ERROR: Primary content is too thin (<120 characters)")
      fileErrors++
    }

    if (dir === "content/blog" && data.body) {
      const pricingWarns = checkPricingFigures(data.body, file, verifiedEntities)
      for (const w of pricingWarns) {
        console.warn(`  WARNING: [pricing] ${fpath}: ${w}`)
      }
    }

    if (fileErrors > 0) {
      console.error(`\n${fpath}: ${fileErrors} error(s)`)
      totalErrors += fileErrors
    }
  }
}

if (totalErrors > 0) {
  console.error(`\n${totalErrors} content lint error(s) found.`)
  process.exit(1)
} else {
  console.log("All content files passed lint checks.")
}
