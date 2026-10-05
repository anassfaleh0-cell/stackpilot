import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import ComparisonPage, { generateMetadata, generateStaticParams } from "@/app/comparisons/[slug]/page"
import { getContentTitle, getComparison } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import sitemap from "@/app/sitemap"

// Phase 5K-C regression contract.
// P1: noindexed comparison slugs were removed from generateStaticParams() while
// dynamicParams = false made Next.js 404 them before any page/metadata code ran.
// P2: public/llms.txt listed 25 published:false URLs that returned 404.

const NOINDEXED_SLUG = "zoom-vs-webex"
const INDEXABLE_SLUG = "gitlab-vs-bitbucket"
const UNPUBLISHED_SLUG = "1password-vs-appwrite"
const UNKNOWN_SLUG = "not-a-real-comparison-xyz"

const ROUTE_FILE = path.join(process.cwd(), "src", "app", "comparisons", "[slug]", "page.tsx")
const LLMS_FILE = path.join(process.cwd(), "public", "llms.txt")

// The 25 llms.txt paths the Phase 5K production probe measured at HTTP 404.
const STALE_LLMS_PATHS = [
  "/best/best-ai-coding-tools",
  "/best/best-analytics-data-agencies",
  "/best/best-api-management-tools",
  "/best/best-authentication-platforms",
  "/best/best-automation-agencies",
  "/best/best-cms-platforms",
  "/best/best-crm-for-enterprise",
  "/best/best-design-creative-agencies",
  "/comparisons/1password-vs-appwrite",
  "/comparisons/1password-vs-auth0",
  "/comparisons/1password-vs-bitwarden",
  "/comparisons/1password-vs-crowdstrike",
  "/comparisons/1password-vs-dashlane",
  "/comparisons/1password-vs-fathom",
  "/comparisons/1password-vs-lastpass",
  "/comparisons/1password-vs-okta",
  "/comparisons/1password-vs-sentinelone",
  "/comparisons/activecampaign-vs-adobe-express",
  "/alternatives/1password-alternatives",
  "/alternatives/affinity-alternatives",
  "/alternatives/ahrefs-alternatives",
  "/alternatives/airtable-alternatives",
  "/alternatives/amplitude-alternatives",
  "/alternatives/auth0-alternatives",
  "/alternatives/basecamp-alternatives",
]

const CONTENT_TYPE_FOR_SEG: Record<string, string> = {
  reviews: "review",
  comparisons: "comparison",
  guides: "guide",
  blog: "blog",
  glossary: "glossary",
  alternatives: "alternative",
  best: "best",
  "use-cases": "use-case",
  industries: "industry",
  research: "research",
  statistics: "statistic",
  hubs: "hub",
}

const APP_DIR = path.join(process.cwd(), "src", "app")

function appRouteExists(dir: string, segs: string[]): boolean {
  if (segs.length === 0) {
    return fs.existsSync(path.join(dir, "page.tsx")) || fs.existsSync(path.join(dir, "route.ts")) || fs.existsSync(path.join(dir, "route.js"))
  }
  const [head, ...rest] = segs
  const exact = path.join(dir, head)
  if (fs.existsSync(exact) && appRouteExists(exact, rest)) return true
  if (!fs.existsSync(dir)) return false
  return fs.readdirSync(dir).some((entry) => /^\[.+\]$/.test(entry) && appRouteExists(path.join(dir, entry), rest))
}

/** True when the path serves HTTP 200 in production: published content, or a real route. */
function pathResolves(p: string): boolean {
  const segs = p.split("/").filter(Boolean)
  const type = segs.length === 2 ? CONTENT_TYPE_FOR_SEG[segs[0]] : undefined
  if (type) return getContentTitle(type, segs[1]) !== null
  return appRouteExists(APP_DIR, segs)
}

function llmsPaths(): string[] {
  const raw = fs.readFileSync(LLMS_FILE, "utf-8")
  const site = /https?:\/\/(?:www\.)?pilotstack\.online([^\s\)>\]"'<]*)/g
  const rel = /(?<![A-Za-z0-9])(\/(?:reviews|comparisons|guides|blog|glossary|alternatives|best|use-cases|industries|research|statistics|hubs|category|authors|tools)\/[A-Za-z0-9._-]+)/g
  const out = new Set<string>()
  for (const m of raw.matchAll(site)) out.add((m[1] || "/").split("#")[0].split("?")[0].replace(/\/$/, "") || "/")
  for (const m of raw.matchAll(rel)) out.add(m[1])
  return [...out]
}

const params = (slug: string) => ({ params: Promise.resolve({ slug }) })

type PageMeta = { robots?: { index?: boolean; follow?: boolean } }
async function robotsOf(slug: string): Promise<{ index?: boolean; follow?: boolean } | undefined> {
  return ((await generateMetadata(params(slug))) as PageMeta).robots
}

describe("P5K-C1: noindexed comparisons render instead of route-level 404", () => {
  it("serves /comparisons/zoom-vs-webex as a published record that is noindexed", () => {
    const cmp = getComparison(NOINDEXED_SLUG)
    expect(cmp).not.toBeNull()
    expect(cmp!.slug).toBe(NOINDEXED_SLUG)
    expect(cmp!.published).not.toBe(false)
    expect(isNoindexed("comparisons", NOINDEXED_SLUG)).toBe(true)
  })

  it("no longer opts the route out of dynamic params", () => {
    const src = fs.readFileSync(ROUTE_FILE, "utf-8")
    expect(src).not.toMatch(/export\s+const\s+dynamicParams\s*=\s*false/)
  })

  it("still excludes the noindexed slug from generateStaticParams (unchanged)", () => {
    const slugs = generateStaticParams().map((p) => p.slug)
    expect(slugs).not.toContain(NOINDEXED_SLUG)
    expect(slugs).toContain(INDEXABLE_SLUG)
  })

  it("resolves page metadata to noindex, follow", async () => {
    expect(await robotsOf(NOINDEXED_SLUG)).toEqual({ index: false, follow: true })
  })

  it("renders the page body instead of throwing notFound()", async () => {
    const el = await ComparisonPage(params(NOINDEXED_SLUG))
    expect(el).toBeTruthy()
    expect(typeof el).toBe("object")
  })
})

describe("P5K-C1: indexable comparisons stay indexable", () => {
  it("keeps a representative live comparison published and indexable", () => {
    const cmp = getComparison(INDEXABLE_SLUG)
    expect(cmp).not.toBeNull()
    expect(cmp!.published).not.toBe(false)
    expect(isNoindexed("comparisons", INDEXABLE_SLUG)).toBe(false)
  })

  it("keeps it in generateStaticParams", () => {
    expect(generateStaticParams().map((p) => p.slug)).toContain(INDEXABLE_SLUG)
  })

  it("resolves page metadata to index, follow", async () => {
    expect(await robotsOf(INDEXABLE_SLUG)).toEqual({ index: true, follow: true })
  })

  it("renders the page body", async () => {
    await expect(ComparisonPage(params(INDEXABLE_SLUG))).resolves.toBeTruthy()
  })

  it("keeps exactly nine published + indexable comparisons", () => {
    expect(generateStaticParams().length).toBe(9)
  })
})

describe("P5K-C1: published:false comparisons still 404", () => {
  it("keeps a published:false record in the repository but unreachable", () => {
    const file = path.join(process.cwd(), "content", "comparisons", `${UNPUBLISHED_SLUG}.json`)
    expect(fs.existsSync(file)).toBe(true)
    expect(JSON.parse(fs.readFileSync(file, "utf-8")).published).toBe(false)
    expect(getComparison(UNPUBLISHED_SLUG)).toBeNull()
    expect(getContentTitle("comparison", UNPUBLISHED_SLUG)).toBeNull()
  })

  it("throws notFound() for a published:false slug", async () => {
    await expect(ComparisonPage(params(UNPUBLISHED_SLUG))).rejects.toThrow()
  })

  it("throws notFound() for an unknown slug", async () => {
    expect(getComparison(UNKNOWN_SLUG)).toBeNull()
    await expect(ComparisonPage(params(UNKNOWN_SLUG))).rejects.toThrow()
  })

  it("keeps all 822 published:false comparison records out of reach", () => {
    const dir = path.join(process.cwd(), "content", "comparisons")
    const unpublished = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .filter((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")).published === false)
    expect(unpublished).toHaveLength(822)
    for (const f of unpublished) expect(getComparison(f.replace(/\.json$/, ""))).toBeNull()
  })
})

describe("P5K-C1/D: sitemap invariants", () => {
  const entries = sitemap()
  const paths = entries.map((e) => new URL(e.url).pathname)

  it("emits exactly 493 URLs", () => {
    expect(entries).toHaveLength(493)
  })

  it("keeps /comparisons/zoom-vs-webex absent", () => {
    expect(paths).not.toContain("/comparisons/zoom-vs-webex")
  })

  it("has zero sitemap URLs that are noindexed", () => {
    const overlap = paths.filter((p) => {
      const segs = p.split("/").filter(Boolean)
      if (segs.length !== 2) return false
      const dir = segs[0]
      if (!CONTENT_TYPE_FOR_SEG[dir]) return false
      return isNoindexed(dir, segs[1])
    })
    expect(overlap).toEqual([])
  })

  it("has zero sitemap URLs that fail to resolve", () => {
    expect(paths.filter((p) => !pathResolves(p))).toEqual([])
  })
})

describe("P5K-C2: llms.txt stale URLs removed", () => {
  const paths = llmsPaths()

  it("lists exactly 98 URLs (was 123)", () => {
    expect(paths).toHaveLength(98)
  })

  it("lists none of the 25 URLs that returned 404", () => {
    expect(paths.filter((p) => STALE_LLMS_PATHS.includes(p))).toEqual([])
  })

  it("resolves every listed URL to a live route", () => {
    expect(paths.filter((p) => !pathResolves(p))).toEqual([])
  })

  it("still lists no comparison detail pages", () => {
    expect(paths.filter((p) => p.startsWith("/comparisons/"))).toEqual([])
  })
})
