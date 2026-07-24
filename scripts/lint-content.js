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
    for (const [name, slug] of Object.entries(TOOL_NAMES)) {
      if (context.includes(name) && !verifiedEntities.has(slug)) {
        warnings.push(`Unverified $ figure near "${name}": ${match[0]}`)
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
    if (data[field] && !/^\d{4}-\d{2}-\d{2}$/.test(data[field])) {
      console.error(`  ERROR: Non-ISO date "${field}": "${data[field]}" (expected YYYY-MM-DD)`)
      errs++
    }
  }
  return errs
}

const dirs = ["content/guides", "content/comparisons", "content/reviews", "content/best", "content/blog"]
let totalErrors = 0
const verifiedEntities = getVerifiedEntities()

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"))
  for (const file of files) {
    const fpath = path.join(dir, file)
    const data = JSON.parse(fs.readFileSync(fpath, "utf-8"))
    const title = data.title || ""
    let fileErrors = 0

    if (checkTitleDuplicates(title, file)) fileErrors++
    fileErrors += checkDateFormats(data, file)

    if (dir === "content/blog" && data.body) {
      const pricingWarns = checkPricingFigures(data.body, file, verifiedEntities)
      for (const w of pricingWarns) {
        console.error(`  WARNING: [pricing] ${w}`)
        fileErrors++
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
