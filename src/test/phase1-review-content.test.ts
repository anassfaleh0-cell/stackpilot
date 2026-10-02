import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"

const COHORT = [
  "affinity", "auth0", "basecamp", "circleci", "close-crm", "copper-crm",
  "copy-ai", "crowdstrike", "dialpad", "evernote", "expensify", "fathom",
  "grafana", "grammarly", "greenhouse", "heap", "hi-bob", "invision",
  "jfrog", "lever", "marketo", "midjourney", "new-relic", "obsidian",
  "okta", "optimizely", "outreach-io", "plausible", "postman", "power-bi",
  "ringcentral", "roam-research", "runway", "sage-intacct", "salesloft",
  "sentinelone", "smartsheet", "survey-monkey", "synthesia", "tableau",
  "telegram", "terraform", "todoist", "vonage", "wave", "workday", "wrike",
  "writesonic", "zeplin", "zoho-books", "zoho-crm", "zoho-people",
]

const REVIEW_DIR = path.join(process.cwd(), "content", "reviews")

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyJson = { [k: string]: any }

function load(slug: string): AnyJson {
  return JSON.parse(fs.readFileSync(path.join(REVIEW_DIR, `${slug}.json`), "utf8"))
}

const ALL_SLUGS = fs
  .readdirSync(REVIEW_DIR)
  .filter((f) => f.endsWith(".json"))
  .map((f) => f.replace(/\.json$/, ""))

const reviews: Record<string, AnyJson> = Object.fromEntries(
  ALL_SLUGS.map((s) => [s, load(s)])
)

const cohort = COHORT.map((s) => reviews[s])
const bySlug = COHORT.map((s, i) => ({ slug: s, review: cohort[i] }))

function norm(s: unknown): string {
  return String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function sentences(s: string): string[] {
  return String(s)
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
}

function stringsOf(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => stringsOf(v, out))
  else if (value && typeof value === "object")
    Object.values(value as AnyJson).forEach((v) => stringsOf(v, out))
  return out
}

/** Body-length prose blocks that would be read as paragraphs by a crawler. */
function paragraphsOf(review: AnyJson): string[] {
  const out: string[] = []
  for (const s of review.content ?? []) {
    if (typeof s.body === "string" && s.body.length > 0) out.push(s.body)
    for (const item of s.items ?? []) if (typeof item === "string") out.push(item)
  }
  for (const f of review.faqs ?? []) {
    if (typeof f.answer === "string") out.push(f.answer)
  }
  for (const p of [...(review.pros ?? []), ...(review.cons ?? [])])
    if (typeof p === "string") out.push(p)
  for (const f of review.features ?? []) {
    if (typeof f.description === "string") out.push(f.description)
    for (const item of f.items ?? []) if (typeof item === "string") out.push(item)
  }
  return out.filter(Boolean)
}

/** Replaces a product's own name tokens so name-swapped clones line up. */
function anonymize(text: string, review: AnyJson): string {
  let t = norm(text)
  const own = new Set<string>()
  const name = String(review.name ?? "").toLowerCase()
  if (name) own.add(name)
  const slug = String(review.slug ?? "").toLowerCase().replace(/-/g, " ")
  if (slug) own.add(slug)
  for (const part of name.split(/\s+/)) if (part.length >= 4) own.add(part)
  for (const part of slug.split(/\s+/)) if (part.length >= 4) own.add(part)
  for (const token of own) {
    t = t.split(token).join(" {p} ")
  }
  return t.replace(/\s+/g, " ").trim()
}

function countByFile(
  entries: Array<{ slug: string; key: string }>
): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()
  for (const { slug, key } of entries) {
    if (!key) continue
    if (!map.has(key)) map.set(key, new Set())
    map.get(key)!.add(slug)
  }
  return map
}

const BANNED_CLAIMS: RegExp[] = [
  /responsive customer support team with expertise in the product/i,
  /capabilities with intuitive interface and powerful features/i,
  /platform with comprehensive tooling/i,
  /excels in this area/i,
  /in our comprehensive evaluation/i,
  /the platform delivers essential functionality/i,
  /support options include comprehensive documentation/i,
  /the platform implements security best practices/i,
  /pricing is structured to provide value/i,
  /serves the\s+category with a focused set of capabilities/i,
  /supports enterprise deployments with features like sso, role-based access control, audit logging/i,
  /\bhands[- ]on\b/i,
  /\bfirst[- ]hand\b/i,
  /\bwe tested\b/i,
  /\bour testing\b/i,
  /\bduring our testing\b/i,
  /\bafter using it for\b/i,
  /\bwhen we signed up\b/i,
  /\bpage set\b/i,
  /\bthese files\b/i,
  /\bthis cohort\b/i,
  /\bour cohort\b/i,
  /\bcohort of pages\b/i,
]

const GENERIC_WORDS = new Set([
  "platform", "software", "suite", "service", "services", "tool", "tools",
  "app", "apps", "system", "systems", "management", "analytics", "security",
  "cloud", "business", "enterprise", "team", "teams", "data", "marketing",
  "sales", "solution", "solutions", "performance", "automation",
  "collaboration", "integration", "integrations", "platforms", "product",
  "products", "workflow", "workflows", "reporting", "pricing", "free",
  "plan", "plans",
])

function distinctiveTokens(review: AnyJson): string[] {
  const raw = [
    ...String(review.name ?? "").toLowerCase().split(/\s+/),
    ...String(review.slug ?? "").toLowerCase().split(/-/),
  ]
  const tokens = raw.filter((t) => t.length >= 4 && !GENERIC_WORDS.has(t))
  const featureTokens = (review.features ?? []).map((f: AnyJson) =>
    String(f.name ?? "").toLowerCase().split(/\s+/)[0]
  )
  return [...new Set([...tokens, ...featureTokens].filter((t) => t.length >= 4 && !GENERIC_WORDS.has(t)))]
}

const DESCRIBES_PRODUCT = (review: AnyJson) => (text: string): boolean => {
  const t = norm(text)
  return distinctiveTokens(review).some((tok) => t.includes(tok))
}

describe("phase 1 — cloned review content gate", () => {
  it("loads the full review set and the 52-page recovery cohort", () => {
    expect(ALL_SLUGS.length).toBeGreaterThanOrEqual(151)
    expect(COHORT).toHaveLength(52)
    for (const slug of COHORT) expect(reviews[slug]).toBeTruthy()
  })

  it("1. has no identical long paragraphs shared across cohort pages", () => {
    const entries: Array<{ slug: string; key: string }> = []
    for (const { slug, review } of bySlug) {
      for (const p of paragraphsOf(review)) {
        const n = norm(p)
        if (n.length >= 160) entries.push({ slug, key: n })
      }
    }
    const shared = [...countByFile(entries)].filter(([, files]) => files.size >= 2)
    expect(shared.map(([k, f]) => `${[...f].join(",")} :: ${k.slice(0, 80)}`)).toEqual([])
  })

  it("2. has no identical multi-sentence sections shared across cohort pages", () => {
    const entries: Array<{ slug: string; key: string }> = []
    for (const { slug, review } of bySlug) {
      for (const s of review.content ?? []) {
        const body = String(s.body ?? "")
        if (sentences(body).length >= 2 && norm(body).length >= 120) {
          entries.push({ slug, key: norm(body) })
        }
      }
    }
    const shared = [...countByFile(entries)].filter(([, files]) => files.size >= 2)
    expect(shared.map(([k, f]) => `${[...f].join(",")} :: ${k.slice(0, 80)}`)).toEqual([])
  })

  it("3. has no shared template fingerprint (section-title signature in 3+ pages)", () => {
    const entries = bySlug.map(({ slug, review }) => ({
      slug,
      key: (review.content ?? []).map((s: AnyJson) => String(s.title ?? "")).join(" | "),
    }))
    const shared = [...countByFile(entries)].filter(([, files]) => files.size >= 3)
    expect(shared.map(([k, f]) => `${[...f].join(",")} :: ${k.slice(0, 90)}`)).toEqual([])
    expect(new Set(entries.map((e) => e.key)).size).toBe(COHORT.length)
  })

  it("4. detects no name-swapped clones (own name normalised away)", () => {
    const entries: Array<{ slug: string; key: string }> = []
    for (const { slug, review } of bySlug) {
      for (const p of paragraphsOf(review)) {
        if (p.length < 160) continue
        const key = anonymize(p, review)
        if (key.length >= 120) entries.push({ slug, key })
      }
    }
    const shared = [...countByFile(entries)].filter(([, files]) => files.size >= 2)
    expect(shared.map(([k, f]) => `${[...f].join(",")} :: ${k.slice(0, 80)}`)).toEqual([])
  })

  it("5. keeps the boilerplate (repeated paragraph) ratio near zero", () => {
    let total = 0
    const seen = new Map<string, number>()
    const dupFiles = new Map<string, Set<string>>()
    for (const { slug, review } of bySlug) {
      for (const p of paragraphsOf(review)) {
        const n = norm(p)
        if (n.length < 120) continue
        total++
        seen.set(n, (seen.get(n) ?? 0) + 1)
        if (!dupFiles.has(n)) dupFiles.set(n, new Set())
        dupFiles.get(n)!.add(slug)
      }
    }
    const duplicated = [...seen.values()].filter((c) => c > 1).length
    expect(total).toBeGreaterThan(300)
    expect(duplicated / total).toBeLessThan(0.02)
    const crossFile = [...dupFiles.values()].filter((s) => s.size > 1).length
    expect(crossFile).toBe(0)
  })

  it("6. contains no unsupported first-hand testing claims", () => {
    const offenders: string[] = []
    for (const { slug, review } of bySlug) {
      for (const text of stringsOf(review)) {
        for (const re of BANNED_CLAIMS) {
          if (re.test(text)) offenders.push(`${slug} :: ${re} :: ${text.slice(0, 100)}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it("7. has no short or empty sections", () => {
    const offenders: string[] = []
    for (const { slug, review } of bySlug) {
      const sections = review.content ?? []
      if (sections.length < 7 || sections.length > 11)
        offenders.push(`${slug} :: ${sections.length} sections`)
      for (const s of sections) {
        const len = String(s.body ?? "").length
        if (len < 280 || len > 1500) offenders.push(`${slug} :: ${s.title} :: ${len}`)
        if (!String(s.title ?? "").trim()) offenders.push(`${slug} :: untitled section`)
      }
      if (!sections.some((s: AnyJson) => s.type === "list"))
        offenders.push(`${slug} :: no list section`)
      if (sections.some((s: AnyJson) => s.type === "list" && ((s.items ?? []).length < 4 || (s.items ?? []).length > 7)))
        offenders.push(`${slug} :: list item count out of range`)
    }
    expect(offenders).toEqual([])
  })

  it("8. is product-specific on every page", () => {
    const offenders: string[] = []
    for (const { slug, review } of bySlug) {
      const describe = DESCRIBES_PRODUCT(review)
      const description = String(review.description ?? "")
      if (description.length < 110 || description.length > 155)
        offenders.push(`${slug} :: description length ${description.length}`)
      if (!describe(description)) offenders.push(`${slug} :: description omits the product`)
      const sections = review.content ?? []
      const specific = sections.filter((s: AnyJson) =>
        describe(`${s.title ?? ""} ${s.body ?? ""}`)
      ).length
      if (specific < Math.ceil(sections.length / 2))
        offenders.push(`${slug} :: only ${specific}/${sections.length} sections name the product`)
      for (const q of review.faqs ?? [])
        if (!describe(String(q.question ?? ""))) offenders.push(`${slug} :: generic FAQ question :: ${q.question}`)
    }
    expect(offenders).toEqual([])
  })

  it("9. has no duplicate titles, descriptions, or FAQ questions across the cohort", () => {
    const descriptions = new Map<string, string[]>()
    const questions = new Map<string, string[]>()
    const signatures = new Map<string, string[]>()
    const push = (m: Map<string, string[]>, key: string, slug: string) => {
      if (!key) return
      if (!m.has(key)) m.set(key, [])
      m.get(key)!.push(slug)
    }
    for (const { slug, review } of bySlug) {
      push(descriptions, norm(review.description ?? ""), slug)
      push(signatures, (review.content ?? []).map((s: AnyJson) => s.title).join(" | "), slug)
      for (const q of review.faqs ?? []) push(questions, norm(q.question ?? ""), slug)
    }
    expect([...descriptions].filter(([, v]) => v.length > 1)).toEqual([])
    expect([...signatures].filter(([, v]) => v.length > 1)).toEqual([])
    expect([...questions].filter(([, v]) => v.length > 1)).toEqual([])
    expect(descriptions.size).toBe(COHORT.length)
    expect(signatures.size).toBe(COHORT.length)
  })

  it("10. carries no contradictory or foreign product name in its identity fields", () => {
    const cohortNames = new Set(COHORT.map((s) => String(reviews[s].name ?? "").toLowerCase()))
    const offenders: string[] = []
    for (const { slug, review } of bySlug) {
      const identity = `${review.tagline ?? ""} ${review.description ?? ""}`.toLowerCase()
      for (const other of cohortNames) {
        if (!other || other === String(review.name ?? "").toLowerCase()) continue
        if (identity.includes(other)) offenders.push(`${slug} :: names "${other}"`)
      }
      const own = String(review.name ?? "").toLowerCase()
      if (!norm(review.description ?? "").includes(norm(own)))
        offenders.push(`${slug} :: description does not contain its own name`)
    }
    expect(offenders).toEqual([])
  })

  it("keeps the review schema the page renderer depends on", () => {
    const offenders: string[] = []
    for (const { slug, review } of bySlug) {
      if ((review.pros ?? []).length !== 5) offenders.push(`${slug} :: pros ${(review.pros ?? []).length}`)
      if ((review.cons ?? []).length !== 3) offenders.push(`${slug} :: cons ${(review.cons ?? []).length}`)
      if ((review.features ?? []).length !== 8) offenders.push(`${slug} :: features ${(review.features ?? []).length}`)
      if ((review.faqs ?? []).length !== 5) offenders.push(`${slug} :: faqs ${(review.faqs ?? []).length}`)
      for (const f of review.features ?? []) {
        if (String(f.name ?? "").trim().split(/\s+/).length > 6)
          offenders.push(`${slug} :: feature name too long :: ${f.name}`)
        if (f.available === false && !/(recorded as absent|recorded as missing|not recorded|no entry|is missing|are missing|lists .* gaps)/i.test(String(f.description ?? "")))
          offenders.push(`${slug} :: unattributed unavailable feature :: ${f.name}`)
      }
      for (const q of review.faqs ?? []) {
        const len = String(q.answer ?? "").length
        if (len < 40 || len > 320) offenders.push(`${slug} :: FAQ answer length ${len}`)
      }
      for (const required of ["slug", "name", "description", "category", "rating", "reviewCount", "pricing", "features", "content", "faqs", "pros", "cons"]) {
        if (review[required] === undefined) offenders.push(`${slug} :: missing ${required}`)
      }
    }
    expect(offenders).toEqual([])
  })

  it("keeps no 7-word content n-gram shared by 4 or more cohort pages", () => {
    const grams = new Map<string, Set<string>>()
    for (const { slug, review } of bySlug) {
      const seen = new Set<string>()
      for (const text of stringsOf(review)) {
        const words = norm(text).split(" ").filter((w) => w.length > 2)
        for (let i = 0; i + 7 <= words.length; i++) {
          const g = words.slice(i, i + 7).join(" ")
          if (seen.has(g)) continue
          seen.add(g)
          if (!grams.has(g)) grams.set(g, new Set())
          grams.get(g)!.add(slug)
        }
      }
    }
    const shared = [...grams].filter(([, files]) => files.size >= 4)
    expect(shared.map(([g, f]) => `${f.size} :: ${[...f].join(",")} :: ${g}`)).toEqual([])
  })
})
