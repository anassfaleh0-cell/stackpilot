import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import { getBest, getAllBest, isContentAvailable } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import { site } from "@/lib/constants"

const SLUG = "best-marketing-seo-enterprise"
const PAGE_PATH = `/best/${SLUG}`
const CONTENT_FILE = path.join(process.cwd(), "content", "best", `${SLUG}.json`)

describe("/best/best-marketing-seo-enterprise recovery", () => {
  it("resolves to a real page instead of notFound()", () => {
    const page = getBest(SLUG)
    expect(page).not.toBeNull()
    expect(page!.slug).toBe(SLUG)
    expect(page!.title).toBe("Best Enterprise SEO Software 2026: Top Platforms Compared")
    expect(page!.category).toBe("Marketing & SEO")
  })

  it("serves substantive content, not a placeholder", () => {
    const page = getBest(SLUG)!
    expect(page!.picks.length).toBeGreaterThanOrEqual(3)
    expect(page!.criteria.length).toBeGreaterThanOrEqual(3)
    expect(page!.faqs.length).toBeGreaterThanOrEqual(3)
    expect(page!.body.length).toBeGreaterThan(4000)
    expect(page!.wordCount).toBeGreaterThanOrEqual(500)
    expect(page!.comparisonTable.rows.length).toBe(page!.picks.length)
  })

  it("is indexable: published and not noindexed", () => {
    const page = getBest(SLUG)!
    expect(page!.published).not.toBe(false)
    expect(isNoindexed("best", SLUG)).toBe(false)
  })

  it("is self-canonical at /best/best-marketing-seo-enterprise", () => {
    const page = getBest(SLUG)!
    expect(page!.slug).toBe(SLUG)
    expect(`${site.url}/best/${page!.slug}`).toBe(`${site.url}${PAGE_PATH}`)
    expect(new URL(`${site.url}${PAGE_PATH}`).pathname).toBe(PAGE_PATH)
  })

  it("is emitted by the sitemap as an indexable URL", () => {
    const sitemapBestPaths = getAllBest()
      .filter((b) => !isNoindexed("best", b.slug))
      .map((b) => `/best/${b.slug}`)
    expect(sitemapBestPaths).toContain(PAGE_PATH)
  })

  it("keeps the route unique: one file, one slug", () => {
    const dir = path.join(process.cwd(), "content", "best")
    const matching = fs
      .readdirSync(dir)
      .filter((f) => f.endsWith(".json"))
      .filter((f) => {
        const parsed = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8")) as { slug?: string }
        return parsed.slug === SLUG
      })
    expect(matching).toEqual([`${SLUG}.json`])
    expect(fs.existsSync(CONTENT_FILE)).toBe(true)
  })

  it("has no internal link pointing at a broken URL", () => {
    const referencingFiles: string[] = []
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name)
        if (entry.isDirectory()) walk(full)
        else if (entry.name.endsWith(".json") && fs.readFileSync(full, "utf-8").includes(SLUG)) {
          referencingFiles.push(full)
        }
      }
    }
    walk(path.join(process.cwd(), "content"))
    expect(referencingFiles).toContain(CONTENT_FILE)
    expect(isContentAvailable("best", SLUG)).toBe(true)
  })

  it("keeps the sibling Marketing & SEO best page indexable", () => {
    const sibling = getBest("best-marketing-software")
    expect(sibling).not.toBeNull()
    expect(sibling!.slug).toBe("best-marketing-software")
    expect(isNoindexed("best", "best-marketing-software")).toBe(false)
  })

  it("keeps the sibling Marketing & SEO best routes resolvable and indexable", () => {
    const siblings = [
      "best-marketing-seo-agencies",
      "best-marketing-seo-freelancers",
      "best-marketing-seo-remote-teams",
      "best-marketing-seo-small-business",
      "best-marketing-seo-startups",
    ]
    for (const slug of siblings) {
      expect(getBest(slug), `${slug} should resolve`).not.toBeNull()
      expect(isNoindexed("best", slug), slug).toBe(false)
    }
  })

  it("still 404s unknown best slugs", () => {
    expect(getBest("best-does-not-exist-xyz")).toBeNull()
    expect(isContentAvailable("best", "best-does-not-exist-xyz")).toBe(false)
  })
})
