const fs = require("fs")
const path = require("path")

const CONTENT_DIR = path.resolve(process.cwd(), "content")
const SUFFIX = " | PilotStack"
const MAX = 60

function shortenTitle(rawTitle, extraSuffix = "") {
  const targetLen = MAX - extraSuffix.length - SUFFIX.length
  if (rawTitle.length <= targetLen) return rawTitle

  let t = rawTitle

  // Remove years (2024-2029) and trailing prepositions
  if (/20[2-9]\d/.test(t)) {
    t = t.replace(/20[2-9]\d/g, "").replace(/\s+/g, " ").trim()
    // Remove trailing prepositions/articles left after year removal
    t = t.replace(/\s+(in|for|of|and|the|a|an|at|to|with)$/i, "").trim()
    if (t.length <= targetLen) return t
  }

  // Remove common verbose phrases first
  const removals = [
    "The Ultimate ", "The Complete ", "The Essential ", "A Complete ", "A Practical ", "A Strategic ",
    "How to ", "The State of ",
  ]
  for (const phrase of removals) {
    if (t.startsWith(phrase)) {
      t = t.slice(phrase.length)
      if (t.length <= targetLen) return t
      t = rawTitle
      break
    }
  }

  // Remove ":" suffix content (keep primary keyword before colon)
  if (t.includes(":")) {
    t = t.split(":")[0].trim()
    if (t.length <= targetLen) return t
    t = rawTitle
  }

  // Try removing subtitle after common separators
  if (t.includes(": ")) {
    const parts = t.split(": ")
    t = parts[0]
    if (t.length <= targetLen) return t
    t = rawTitle
  }

  // Restore from raw, try removing "2026" only
  t = rawTitle.replace(/20[2-9]\d/g, "").replace(/\s+/g, " ").trim()
  if (t.length <= targetLen) return t

  // Try truncating at word boundary
  t = rawTitle
  const words = t.split(" ")
  let result = ""
  for (const word of words) {
    if ((result ? result + " " + word : word).length <= targetLen) {
      result = result ? result + " " + word : word
    } else {
      break
    }
  }
  if (result.length > 10) return result
  return rawTitle.slice(0, targetLen - 1) + "…"
}

function processDir(dir, titleField, extraSuffix = "") {
  const dirPath = path.join(CONTENT_DIR, dir)
  if (!fs.existsSync(dirPath)) return
  for (const file of fs.readdirSync(dirPath).filter(f => f.endsWith(".json"))) {
    const fp = path.join(dirPath, file)
    const data = JSON.parse(fs.readFileSync(fp, "utf-8"))
    const rawTitle = data[titleField]
    if (!rawTitle) continue

    const fullTitle = rawTitle + extraSuffix + SUFFIX
    if (fullTitle.length > MAX) {
      const oldTitle = rawTitle
      data[titleField] = shortenTitle(rawTitle, extraSuffix)
      if (oldTitle !== data[titleField]) {
        fs.writeFileSync(fp, JSON.stringify(data, null, 2) + "\n")
        console.log(`  ${dir}/${file}: "${oldTitle}" -> "${data[titleField]}"`)
      }
    }
  }
}

processDir("reviews", "name", " Review 2026")
processDir("comparisons", "title", "")
processDir("guides", "title", "")
processDir("blog", "title", "")
processDir("alternatives", "title", "")
processDir("best", "title", "")
processDir("hubs", "title", "")
processDir("industries", "title", "")
processDir("use-cases", "title", "")
processDir("research", "title", "")
processDir("statistics", "title", "")
processDir("glossary", "term", "")
