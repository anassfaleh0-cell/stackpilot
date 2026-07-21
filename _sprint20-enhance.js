// Sprint 20: Batch enhance templates — RelatedContent, SVG aria-hidden, semantic HTML
const fs = require("node:fs")

const templates = [
  "src/app/best/[slug]/page.tsx",
  "src/app/alternatives/[slug]/page.tsx",
  "src/app/industries/[slug]/page.tsx",
  "src/app/use-cases/[slug]/page.tsx",
  "src/app/hubs/[slug]/page.tsx",
  "src/app/category/[slug]/page.tsx",
]

// Phase 2: Add EnhancedRelatedContent import + component
templates.forEach(fp => {
  if (!fs.existsSync(fp)) return
  let c = fs.readFileSync(fp, "utf8")
  if (c.includes("EnhancedRelatedContent")) return

  // Add import after InternalLinks import
  c = c.replace(
    'import { InternalLinks } from "@/components/content/internal-links"',
    'import { InternalLinks } from "@/components/content/internal-links"\nimport { EnhancedRelatedContent } from "@/components/content/enhanced-related-content"'
  )
  fs.writeFileSync(fp, c)
  console.log(fp.split("/").slice(1,-2).join("/") + ": import added")
})

// Phase 2: Add EnhancedRelatedContent component + Additional contextual links
templates.forEach(fp => {
  let c = fs.readFileSync(fp, "utf8")
  
  // Add EnhancedRelatedContent after InternalLinks
  // Pattern: <InternalLinks category={...} /> followed by more content
  if (!c.includes("<EnhancedRelatedContent")) {
    // Find the InternalLinks line and add EnhancedRelatedContent after
    const lines = c.split("\n")
    const newLines = []
    let found = false
    
    for (let i = 0; i < lines.length; i++) {
      newLines.push(lines[i])
      if (lines[i].includes("<InternalLinks category=") && !found) {
        found = true
        const indent = lines[i].match(/^\s*/)[0]
        // Extract the category expression from InternalLinks
        const match = lines[i].match(/category=\{([^}]+)\}/)
        const catExpr = match ? match[1] : "page.category || guide.category || alt.category || ind.industry || uc.category || hub.audience || categoryData.name"
        newLines.push(`${indent}\n${indent}<EnhancedRelatedContent`)
        newLines.push(`${indent}  title="More Resources"`)
        newLines.push(`${indent}  maxItems={6}`)
        newLines.push(`${indent}/>`)
      }
    }
    c = newLines.join("\n")
    fs.writeFileSync(fp, c)
    console.log(fp.split("/").slice(1,-2).join("/") + ": EnhancedRelatedContent added")
  }
})

// Phase 4: Fix SVG aria-hidden on all page templates
const allPageTemplates = [
  "src/app/reviews/[slug]/page.tsx",
  "src/app/comparisons/[slug]/page.tsx",
  "src/app/guides/[slug]/page.tsx",
  "src/app/best/[slug]/page.tsx",
  "src/app/alternatives/[slug]/page.tsx",
  "src/app/industries/[slug]/page.tsx",
  "src/app/use-cases/[slug]/page.tsx",
  "src/app/hubs/[slug]/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/glossary/[slug]/page.tsx",
  "src/app/research/[slug]/page.tsx",
  "src/app/statistics/[slug]/page.tsx",
  "src/app/category/[slug]/page.tsx",
  "src/app/tools/[slug]/page.tsx",
  "src/app/page.tsx",
  "src/app/authors/[slug]/page.tsx",
]

allPageTemplates.forEach(fp => {
  if (!fs.existsSync(fp)) return
  let c = fs.readFileSync(fp, "utf8")
  
  // Replace <svg without aria-hidden (that also don't have role="img")
  // Pattern: <svg ...> that is not aria-hidden and not role="img"
  c = c.replace(/<svg\s+(?!.*?aria-hidden)(?!.*?role="img")([^>]*?)>/g, (match, attrs) => {
    // Don't change SVGs that are already accessible
    if (match.includes('aria-hidden') || match.includes('role="img"')) return match
    // Add aria-hidden="true" to decorative SVGs
    // Check if there are already attributes
    if (attrs.trim().length > 0) {
      return match.replace('<svg ', '<svg aria-hidden="true" ')
    }
    return match
  })
  
  fs.writeFileSync(fp, c)
  console.log(fp.split("/").slice(2).join("/") + ": SVG aria-hidden fixed")
})

console.log("\nDone.")
