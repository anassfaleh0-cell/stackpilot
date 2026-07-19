const fs = require("fs")
const path = require("path")

const CONTENT_DIR = path.resolve(process.cwd(), "content")

// Collect all existing slugs
const existingComparisons = new Set(
  fs.readdirSync(path.join(CONTENT_DIR, "comparisons"))
    .filter(f => f.endsWith(".json"))
    .map(f => f.replace(".json", ""))
)

const existingGuides = new Set(
  fs.readdirSync(path.join(CONTENT_DIR, "guides"))
    .filter(f => f.endsWith(".json"))
    .map(f => f.replace(".json", ""))
)

const existingBlog = new Set(
  fs.readdirSync(path.join(CONTENT_DIR, "blog"))
    .filter(f => f.endsWith(".json"))
    .map(f => f.replace(".json", ""))
)

console.log(`Existing comparisons: ${existingComparisons.size}`)
console.log(`Existing guides: ${existingGuides.size}`)
console.log(`Existing blog: ${existingBlog.size}`)

let fixes = 0

// Fix all alternative files
const altFiles = fs.readdirSync(path.join(CONTENT_DIR, "alternatives"))
  .filter(f => f.endsWith(".json"))

for (const file of altFiles) {
  const filePath = path.join(CONTENT_DIR, "alternatives", file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  let changed = false

  // Fix relatedComparisons
  if (data.relatedComparisons && Array.isArray(data.relatedComparisons)) {
    const valid = data.relatedComparisons.filter(slug => existingComparisons.has(slug))
    if (valid.length !== data.relatedComparisons.length) {
      const removed = data.relatedComparisons.filter(slug => !existingComparisons.has(slug))
      console.log(`  ${file}: removing ${removed.length} broken comparison links: ${removed.join(", ")}`)
      data.relatedComparisons = valid
      changed = true
    }
  }

  // Fix relatedGuides
  if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
    const valid = data.relatedGuides.filter(slug => existingGuides.has(slug))
    if (valid.length !== data.relatedGuides.length) {
      const removed = data.relatedGuides.filter(slug => !existingGuides.has(slug))
      console.log(`  ${file}: removing ${removed.length} broken guide links: ${removed.join(", ")}`)
      data.relatedGuides = valid
      changed = true
    }
  }

  // Fix relatedPosts
  if (data.relatedPosts && Array.isArray(data.relatedPosts)) {
    const valid = data.relatedPosts.filter(slug => existingBlog.has(slug))
    if (valid.length !== data.relatedPosts.length) {
      const removed = data.relatedPosts.filter(slug => !existingBlog.has(slug))
      console.log(`  ${file}: removing ${removed.length} broken blog links: ${removed.join(", ")}`)
      data.relatedPosts = valid
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    fixes++
  }
}

console.log(`\nFixed ${fixes} files with broken links`)

// Also fix comparisons that may have broken links
const compFiles = fs.readdirSync(path.join(CONTENT_DIR, "comparisons"))
  .filter(f => f.endsWith(".json"))

for (const file of compFiles) {
  const filePath = path.join(CONTENT_DIR, "comparisons", file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  let changed = false

  if (data.relatedComparisons && Array.isArray(data.relatedComparisons)) {
    const valid = data.relatedComparisons.filter(slug => existingComparisons.has(slug))
    if (valid.length !== data.relatedComparisons.length) {
      const removed = data.relatedComparisons.filter(slug => !existingComparisons.has(slug))
      console.log(`  comparisons/${file}: removing ${removed.length} broken comparison links: ${removed.join(", ")}`)
      data.relatedComparisons = valid
      changed = true
    }
  }

  if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
    const valid = data.relatedGuides.filter(slug => existingGuides.has(slug))
    if (valid.length !== data.relatedGuides.length) {
      const removed = data.relatedGuides.filter(slug => !existingGuides.has(slug))
      console.log(`  comparisons/${file}: removing ${removed.length} broken guide links: ${removed.join(", ")}`)
      data.relatedGuides = valid
      changed = true
    }
  }

  if (data.relatedPosts && Array.isArray(data.relatedPosts)) {
    const valid = data.relatedPosts.filter(slug => existingBlog.has(slug))
    if (valid.length !== data.relatedPosts.length) {
      const removed = data.relatedPosts.filter(slug => !existingBlog.has(slug))
      console.log(`  comparisons/${file}: removing ${removed.length} broken blog links: ${removed.join(", ")}`)
      data.relatedPosts = valid
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    fixes++
  }
}

// Fix reviews that may have broken links
const reviewFiles = fs.readdirSync(path.join(CONTENT_DIR, "reviews"))
  .filter(f => f.endsWith(".json"))

for (const file of reviewFiles) {
  const filePath = path.join(CONTENT_DIR, "reviews", file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  let changed = false

  if (data.relatedComparisons && Array.isArray(data.relatedComparisons)) {
    const valid = data.relatedComparisons.filter(slug => existingComparisons.has(slug))
    if (valid.length !== data.relatedComparisons.length) {
      const removed = data.relatedComparisons.filter(slug => !existingComparisons.has(slug))
      console.log(`  reviews/${file}: removing ${removed.length} broken comparison links: ${removed.join(", ")}`)
      data.relatedComparisons = valid
      changed = true
    }
  }

  if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
    const valid = data.relatedGuides.filter(slug => existingGuides.has(slug))
    if (valid.length !== data.relatedGuides.length) {
      const removed = data.relatedGuides.filter(slug => !existingGuides.has(slug))
      console.log(`  reviews/${file}: removing ${removed.length} broken guide links: ${removed.join(", ")}`)
      data.relatedGuides = valid
      changed = true
    }
  }

  if (data.relatedPosts && Array.isArray(data.relatedPosts)) {
    const valid = data.relatedPosts.filter(slug => existingBlog.has(slug))
    if (valid.length !== data.relatedPosts.length) {
      const removed = data.relatedPosts.filter(slug => !existingBlog.has(slug))
      console.log(`  reviews/${file}: removing ${removed.length} broken blog links: ${removed.join(", ")}`)
      data.relatedPosts = valid
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    fixes++
  }
}

// Fix guides that may have broken links
const guideFiles = fs.readdirSync(path.join(CONTENT_DIR, "guides"))
  .filter(f => f.endsWith(".json"))

for (const file of guideFiles) {
  const filePath = path.join(CONTENT_DIR, "guides", file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  let changed = false

  if (data.relatedComparisons && Array.isArray(data.relatedComparisons)) {
    const valid = data.relatedComparisons.filter(slug => existingComparisons.has(slug))
    if (valid.length !== data.relatedComparisons.length) {
      const removed = data.relatedComparisons.filter(slug => !existingComparisons.has(slug))
      console.log(`  guides/${file}: removing ${removed.length} broken comparison links: ${removed.join(", ")}`)
      data.relatedComparisons = valid
      changed = true
    }
  }

  if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
    const valid = data.relatedGuides.filter(slug => existingGuides.has(slug))
    if (valid.length !== data.relatedGuides.length) {
      const removed = data.relatedGuides.filter(slug => !existingGuides.has(slug))
      console.log(`  guides/${file}: removing ${removed.length} broken guide links: ${removed.join(", ")}`)
      data.relatedGuides = valid
      changed = true
    }
  }

  if (data.relatedPosts && Array.isArray(data.relatedPosts)) {
    const valid = data.relatedPosts.filter(slug => existingBlog.has(slug))
    if (valid.length !== data.relatedPosts.length) {
      const removed = data.relatedPosts.filter(slug => !existingBlog.has(slug))
      console.log(`  guides/${file}: removing ${removed.length} broken blog links: ${removed.join(", ")}`)
      data.relatedPosts = valid
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    fixes++
  }
}

// Fix best files that may have broken links
const bestFiles = fs.readdirSync(path.join(CONTENT_DIR, "best"))
  .filter(f => f.endsWith(".json"))

for (const file of bestFiles) {
  const filePath = path.join(CONTENT_DIR, "best", file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  let changed = false

  if (data.relatedComparisons && Array.isArray(data.relatedComparisons)) {
    const valid = data.relatedComparisons.filter(slug => existingComparisons.has(slug))
    if (valid.length !== data.relatedComparisons.length) {
      const removed = data.relatedComparisons.filter(slug => !existingComparisons.has(slug))
      console.log(`  best/${file}: removing ${removed.length} broken comparison links: ${removed.join(", ")}`)
      data.relatedComparisons = valid
      changed = true
    }
  }

  if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
    const valid = data.relatedGuides.filter(slug => existingGuides.has(slug))
    if (valid.length !== data.relatedGuides.length) {
      const removed = data.relatedGuides.filter(slug => !existingGuides.has(slug))
      console.log(`  best/${file}: removing ${removed.length} broken guide links: ${removed.join(", ")}`)
      data.relatedGuides = valid
      changed = true
    }
  }

  if (data.relatedPosts && Array.isArray(data.relatedPosts)) {
    const valid = data.relatedPosts.filter(slug => existingBlog.has(slug))
    if (valid.length !== data.relatedPosts.length) {
      const removed = data.relatedPosts.filter(slug => !existingBlog.has(slug))
      console.log(`  best/${file}: removing ${removed.length} broken blog links: ${removed.join(", ")}`)
      data.relatedPosts = valid
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    fixes++
  }
}

// Fix hubs files
const hubFiles = fs.readdirSync(path.join(CONTENT_DIR, "hubs"))
  .filter(f => f.endsWith(".json"))

for (const file of hubFiles) {
  const filePath = path.join(CONTENT_DIR, "hubs", file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  let changed = false

  if (data.relatedComparisons && Array.isArray(data.relatedComparisons)) {
    const valid = data.relatedComparisons.filter(slug => existingComparisons.has(slug))
    if (valid.length !== data.relatedComparisons.length) {
      const removed = data.relatedComparisons.filter(slug => !existingComparisons.has(slug))
      console.log(`  hubs/${file}: removing ${removed.length} broken comparison links: ${removed.join(", ")}`)
      data.relatedComparisons = valid
      changed = true
    }
  }

  if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
    const valid = data.relatedGuides.filter(slug => existingGuides.has(slug))
    if (valid.length !== data.relatedGuides.length) {
      const removed = data.relatedGuides.filter(slug => !existingGuides.has(slug))
      console.log(`  hubs/${file}: removing ${removed.length} broken guide links: ${removed.join(", ")}`)
      data.relatedGuides = valid
      changed = true
    }
  }

  if (data.relatedPosts && Array.isArray(data.relatedPosts)) {
    const valid = data.relatedPosts.filter(slug => existingBlog.has(slug))
    if (valid.length !== data.relatedPosts.length) {
      const removed = data.relatedPosts.filter(slug => !existingBlog.has(slug))
      console.log(`  hubs/${file}: removing ${removed.length} broken blog links: ${removed.join(", ")}`)
      data.relatedPosts = valid
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    fixes++
  }
}

// Fix industries files
const industryFiles = fs.readdirSync(path.join(CONTENT_DIR, "industries"))
  .filter(f => f.endsWith(".json"))

for (const file of industryFiles) {
  const filePath = path.join(CONTENT_DIR, "industries", file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  let changed = false

  if (data.relatedComparisons && Array.isArray(data.relatedComparisons)) {
    const valid = data.relatedComparisons.filter(slug => existingComparisons.has(slug))
    if (valid.length !== data.relatedComparisons.length) {
      const removed = data.relatedComparisons.filter(slug => !existingComparisons.has(slug))
      console.log(`  industries/${file}: removing ${removed.length} broken comparison links: ${removed.join(", ")}`)
      data.relatedComparisons = valid
      changed = true
    }
  }

  if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
    const valid = data.relatedGuides.filter(slug => existingGuides.has(slug))
    if (valid.length !== data.relatedGuides.length) {
      const removed = data.relatedGuides.filter(slug => !existingGuides.has(slug))
      console.log(`  industries/${file}: removing ${removed.length} broken guide links: ${removed.join(", ")}`)
      data.relatedGuides = valid
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    fixes++
  }
}

// Fix use-cases files
const useCaseFiles = fs.readdirSync(path.join(CONTENT_DIR, "use-cases"))
  .filter(f => f.endsWith(".json"))

for (const file of useCaseFiles) {
  const filePath = path.join(CONTENT_DIR, "use-cases", file)
  const data = JSON.parse(fs.readFileSync(filePath, "utf-8"))
  let changed = false

  if (data.relatedComparisons && Array.isArray(data.relatedComparisons)) {
    const valid = data.relatedComparisons.filter(slug => existingComparisons.has(slug))
    if (valid.length !== data.relatedComparisons.length) {
      const removed = data.relatedComparisons.filter(slug => !existingComparisons.has(slug))
      console.log(`  use-cases/${file}: removing ${removed.length} broken comparison links: ${removed.join(", ")}`)
      data.relatedComparisons = valid
      changed = true
    }
  }

  if (data.relatedGuides && Array.isArray(data.relatedGuides)) {
    const valid = data.relatedGuides.filter(slug => existingGuides.has(slug))
    if (valid.length !== data.relatedGuides.length) {
      const removed = data.relatedGuides.filter(slug => !existingGuides.has(slug))
      console.log(`  use-cases/${file}: removing ${removed.length} broken guide links: ${removed.join(", ")}`)
      data.relatedGuides = valid
      changed = true
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n")
    fixes++
  }
}

console.log(`\nTotal fixes applied: ${fixes}`)
