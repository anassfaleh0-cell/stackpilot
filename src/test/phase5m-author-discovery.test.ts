import { describe, it, expect } from "vitest"
import fs from "node:fs"
import path from "node:path"
import sitemap from "@/app/sitemap"
import { generateMetadata, generateStaticParams } from "@/app/authors/[slug]/page"
import { PUBLIC_AUTHOR_SLUGS, isPublicAuthor } from "@/lib/authors"

const AUTHORS_INDEX_FILE = path.join(process.cwd(), "src", "app", "authors", "page.tsx")
const AUTHOR_ROUTE_FILE = path.join(process.cwd(), "src", "app", "authors", "[slug]", "page.tsx")
const params = (slug: string) => ({ params: Promise.resolve({ slug }) })

type PageMeta = { robots?: { index?: boolean; follow?: boolean } }

async function robotsOf(slug: string): Promise<PageMeta["robots"]> {
  return ((await generateMetadata(params(slug))) as PageMeta).robots
}

const identitySlugs = generateStaticParams().map((p) => p.slug)
const unlistedSlugs = identitySlugs.filter((slug) => !isPublicAuthor(slug))

describe("P5M-W1: one authoritative author slug source", () => {
  it("emits exactly the publicly listed authors into the sitemap", () => {
    const authorPaths = sitemap()
      .map((e) => new URL(e.url).pathname)
      .filter((p) => p.startsWith("/authors/"))
    expect(authorPaths).toHaveLength(PUBLIC_AUTHOR_SLUGS.length)
    for (const slug of PUBLIC_AUTHOR_SLUGS) expect(authorPaths).toContain(`/authors/${slug}`)
    expect(authorPaths).toContain("/authors/pilotstack-team")
  })

  it("keeps the sitemap aligned with the full current content corpus", () => {
    expect(sitemap().length).toBeGreaterThan(1900)
  })

  it("prerenders every author identity, listed or not", () => {
    expect(identitySlugs).toEqual(
      expect.arrayContaining(["sarah-chen", "marcus-rivera", "emily-nakamura", "pilotstack-team"])
    )
    for (const slug of PUBLIC_AUTHOR_SLUGS) expect(identitySlugs).toContain(slug)
  })

  it("serves publicly listed authors as index, follow", async () => {
    for (const slug of PUBLIC_AUTHOR_SLUGS) {
      const robots = await robotsOf(slug)
      expect(robots).toMatchObject({ index: true, follow: true })
    }
  })

  it("serves every unlisted author identity with the site's exclusion convention", async () => {
    expect(unlistedSlugs).toEqual([])
    for (const slug of unlistedSlugs) {
      const robots = await robotsOf(slug)
      expect(robots).toMatchObject({ index: false, follow: false })
    }
  })

  it("keeps the public author index in step with the shared source", () => {
    const src = fs.readFileSync(AUTHORS_INDEX_FILE, "utf-8")
    for (const slug of PUBLIC_AUTHOR_SLUGS) expect(src).toContain(slug)
    expect(src).toContain("isPublicAuthor")
    expect(isPublicAuthor("pilotstack-team")).toBe(true)
  })

  it("keeps the author route in step with the shared source", () => {
    const src = fs.readFileSync(AUTHOR_ROUTE_FILE, "utf-8")
    expect(src).toContain("noIndex: !isPublicAuthor(slug)")
  })
})
