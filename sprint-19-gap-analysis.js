// Sprint 19 Phase 1: Content Gap Analysis
const fs = require("node:fs")
const path = require("node:path")

const BASE = "C:/Users/user/Desktop/DEEPSK/content"
const now = "July 20, 2026"

// Load all content
const all = {}
const types = ["reviews","comparisons","best","guides","alternatives","industries","use-cases","hubs","categories","blog","glossary","research","statistics"]
types.forEach(t => {
  const dir = path.join(BASE, t)
  if (!fs.existsSync(dir)) return
  all[t] = {}
  fs.readdirSync(dir).filter(f => f.endsWith(".json")).forEach(f => {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f)))
      all[t][d.slug || f.replace(".json","")] = d
    } catch(e) {}
  })
})

// Category mapping for tools
const categoryTools = {}
Object.values(all.reviews||{}).forEach(r => {
  const cat = r.category
  if (!categoryTools[cat]) categoryTools[cat] = []
  categoryTools[cat].push(r)
})

console.log("=".repeat(80))
console.log("SPRINT 19 — PHASE 1: CONTENT GAP ANALYSIS")
console.log("=".repeat(80))
console.log(`Date: ${now}`)
console.log("")

// 1. Category depth analysis
console.log("--- 1. CATEGORY CLUSTER DEPTH ---")
const categories = Object.keys(categoryTools).sort()
categories.forEach(cat => {
  const reviews = categoryTools[cat] || []
  const comps = Object.values(all.comparisons||{}).filter(c => c.category === cat)
  const bests = Object.values(all.best||{}).filter(b => b.category === cat)
  const guides = Object.values(all.guides||{}).filter(g => g.category === cat)
  const alts = Object.values(all.alternatives||{}).filter(a => a.category === cat)
  const ucs = Object.values(all["use-cases"]||{}).filter(u => u.category === cat)
  const total = reviews.length + comps.length + bests.length + guides.length + alts.length + ucs.length
  
  const issues = []
  if (reviews.length < 12) issues.push(`only ${reviews.length} reviews`)
  if (bests.length < 8) issues.push(`only ${bests.length} best pages`)
  if (comps.length < 15) issues.push(`only ${comps.length} comparisons`)
  if (guides.length < 8) issues.push(`only ${guides.length} guides`)
  if (alts.length < 8) issues.push(`only ${alts.length} alt pages`)
  if (ucs.length < 5) issues.push(`only ${ucs.length} use-cases`)
  
  const score = issues.length === 0 ? "GOOD" : issues.length <= 2 ? "FAIR" : "THIN"
  console.log(`\n${cat} (${total} total) [${score}]`)
  console.log(`  Reviews: ${reviews.length} | Best: ${bests.length} | Comps: ${comps.length} | Guides: ${guides.length} | Alts: ${alts.length} | Use-cases: ${ucs.length}`)
  if (issues.length) console.log(`  ISSUES: ${issues.join(", ")}`)
})

// 2. Missing commercial keywords
console.log("\n\n--- 2. MISSING COMMERCIAL KEYWORDS ---")
const commercialPatterns = [
  "Best {Category} Software",
  "Best {Category} Tools",
  "Best Free {Category} Software",
  "Top {Category} Solutions",
  "Top-Rated {Category} Platforms",
  "Best {Category} for Small Business",
  "Best {Category} for Enterprise",
  "Best {Category} for Startups",
]
const audienceTypes = ["Small Business", "Enterprise", "Startups", "Freelancers", "Agencies", "Nonprofits", "Ecommerce"]

categories.forEach(cat => {
  const bestNames = new Set(Object.values(all.best||{}).filter(b => b.category === cat).map(b => (b.title||b.name||"").toLowerCase()))
  const catShort = cat.replace(/[&].*$/,"").trim()
  commercialPatterns.forEach(pattern => {
    const kw = pattern.replace("{Category}", catShort).toLowerCase()
    const found = Array.from(bestNames).some(name => name.includes(catShort.toLowerCase()))
    if (!found && !Array.from(bestNames).some(n => n.includes(cat.toLowerCase()))) {
      console.log(`  MISSING: "${pattern.replace("{Category}", catShort)}" in ${cat}`)
    }
  })
})

// Cross-audience best pages missing
categories.forEach(cat => {
  const bests = Object.values(all.best||{}).filter(b => b.category === cat)
  const bestNames = bests.map(b => (b.title||b.name||"").toLowerCase()).join(" ")
  audienceTypes.forEach(aud => {
    if (!bestNames.includes(aud.toLowerCase()) && !bestNames.includes(aud.toLowerCase().replace(" ","-"))) {
      const slug = `best-${cat.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-$/,"")}-${aud.toLowerCase().replace(/[^a-z0-9]+/g,"-")}`
      if (!all.best?.[slug]) {
        console.log(`  MISSING: Best ${cat} for ${aud}`)
      }
    }
  })
})

// 3. Missing comparison pairs
console.log("\n\n--- 3. MISSING HIGH-INTENT COMPARISON PAIRS ---")
const allToolNames = Object.values(all.reviews||{}).map(r => ({slug: r.slug||r.name?.toLowerCase().replace(/\s+/g,"-"), name: r.name}))
const existingPairs = new Set()
Object.values(all.comparisons||{}).forEach(c => {
  const pair = [c.tool1Slug, c.tool2Slug].sort().join(" vs ")
  existingPairs.add(pair)
})

const highIntentPairs = [
  ["Slack","Microsoft Teams"], ["ClickUp","Monday.com"], ["Asana","Trello"],
  ["HubSpot","Salesforce"], ["Jira","Linear"], ["Canva","Figma"],
  ["GitHub","GitLab"], ["QuickBooks","Xero"], ["FreshBooks","Xero"],
  ["Mailchimp","HubSpot"], ["Zoom","Microsoft Teams"], ["Notion","ClickUp"],
  ["Notion","Coda"], ["Airtable","Smartsheet"], ["Monday.com","Wrike"],
  ["Zoho CRM","Pipedrive"], ["SEMrush","Ahrefs"], ["Google Analytics","Mixpanel"],
  ["ChatGPT","Claude"], ["ChatGPT","Jasper"], ["Midjourney","DALL-E"],
  ["Grammarly","ProWritingAid"], ["Figma","Sketch"], ["Webflow","Framer"],
  ["Postman","Insomnia"], ["Docker","Podman"], ["Stripe","PayPal"],
  ["Gusto","BambooHR"], ["ADP","Rippling"], ["BambooHR","Rippling"],
  ["Linear","Shortcut"], ["Asana","Basecamp"], ["Trello","Basecamp"],
  ["Pipedrive","Close CRM"], ["Salesforce","HubSpot"], ["Marketo","HubSpot"],
  ["Tableau","Power BI"], ["Amplitude","Mixpanel"], ["Hotjar","Crazy Egg"],
  ["Notion","Evernote"], ["Calendly","Calendly"], ["1Password","Bitwarden"],
  ["Vercel","Netlify"], ["Firebase","Supabase"], ["Sentry","LogRocket"],
  ["Zoom","Google Meet"], ["Slack","Discord"], ["Synthesia","HeyGen"],
  ["Jasper","Writesonic"], ["Runway","Pika Labs"],
]

highIntentPairs.forEach(([a,b]) => {
  const aSlug = a.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/,"")
  const bSlug = b.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/-+$/,"")
  const pair = [aSlug, bSlug].sort().join(" vs ")
  if (!existingPairs.has(pair) && (all.reviews?.[aSlug] || all.reviews?.[bSlug])) {
    console.log(`  MISSING: ${a} vs ${b}`)
  }
})

// 4. FAQ count gap
console.log("\n\n--- 4. FAQ QUALITY GAP ---")
types.slice(0,5).forEach(t => {
  const entries = Object.values(all[t]||{})
  let low = 0
  entries.forEach(e => {
    const count = e.faqs?.length || 0
    if (count < 8) low++
  })
  console.log(`  ${t}: ${entries.length} pages, ${low} with <8 FAQs` + (low > 0 ? ` — NEEDS EXPANSION` : ""))
})

// 5. Missing review fields
console.log("\n\n--- 5. REVIEW CONTENT GAPS ---")
let missingVerdict = 0, missingPricing = 0, missingUseCases = 0, missingDifficulty = 0
Object.values(all.reviews||{}).forEach(r => {
  const content = r.content || []
  const hasVerdict = Array.isArray(content) ? content.some(s => (s.title||"").toLowerCase().includes("verdict")) : false
  const hasUseCases = Array.isArray(content) ? content.some(s => (s.title||"").toLowerCase().includes("use case")) : false
  if (!hasVerdict) missingVerdict++
  if (!hasUseCases) missingUseCases++
  if (r.difficulty === undefined || r.difficulty === null) missingDifficulty++
  if (!r.pricing || (Array.isArray(r.pricing) && r.pricing.length === 0)) missingPricing++
})
console.log(`  Reviews missing dedicated "Verdict": ${missingVerdict}`)
console.log(`  Reviews missing "Use Cases": ${missingUseCases}`)
console.log(`  Reviews missing "Difficulty": ${missingDifficulty}`)
console.log(`  Reviews missing pricing data: ${missingPricing}`)

// Summary
console.log("\n\n--- SUMMARY ---")
const totalPages = Object.values(all).reduce((sum, t) => sum + Object.keys(t).length, 0)
console.log(`Current total pages: ${totalPages}`)
console.log(`Current reviews: ${Object.keys(all.reviews||{}).length}`)
console.log(`Current comparisons: ${Object.keys(all.comparisons||{}).length}`)
console.log(`Current best pages: ${Object.keys(all.best||{}).length}`)
console.log(`Current guides: ${Object.keys(all.guides||{}).length}`)
console.log(`Current alternatives: ${Object.keys(all.alternatives||{}).length}`)

console.log(`\nTarget: 1100+ pages`)
console.log(`Need to generate: ${Math.max(0, 1100 - totalPages)} additional pages`)
console.log("\nDone.")
