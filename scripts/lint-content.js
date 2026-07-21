const fs = require("fs")
const path = require("path")

const CONTENT_DIRS = ["content/guides", "content/comparisons", "content/reviews", "content/best", "content/blog"]
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

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

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => f.endsWith(".json"))
  for (const file of files) {
    const fpath = path.join(dir, file)
    const data = JSON.parse(fs.readFileSync(fpath, "utf-8"))
    const title = data.title || ""
    let fileErrors = 0

    if (checkTitleDuplicates(title, file)) fileErrors++
    fileErrors += checkDateFormats(data, file)

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
