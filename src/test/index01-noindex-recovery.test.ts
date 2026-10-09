import { describe, it, expect } from "vitest"
import fs from "node:fs"
import { isNoindexed } from "@/lib/noindex"
import { getContentTitle } from "@/lib/content/registry"
import sitemap from "@/app/sitemap"
import { metadata as searchMetadata } from "@/app/search/page"
import { metadata as dashboardMetadata } from "@/app/dashboard/page"

const SITE = "https://pilotstack.online"

describe("site-wide content indexability policy", () => {
  it("does not noindex real content records", () => {
    const manifest = JSON.parse(fs.readFileSync("noindex-list.json", "utf8")) as { directories: Record<string, { keep?: string[]; noindex?: string[] }> }
    const typeByDir: Record<string, string> = { reviews: "review", comparisons: "comparison", guides: "guide", glossary: "glossary", alternatives: "alternative", best: "best", "use-cases": "use-case", industries: "industry", research: "research", statistics: "statistic", hubs: "hub", blog: "blog" }
    for (const [dir, data] of Object.entries(manifest.directories)) {
      const type = typeByDir[dir]
      if (!type) continue
      for (const slug of data.keep ?? []) {
        expect(getContentTitle(type, slug), dir + "/" + slug).not.toBeNull()
        expect(isNoindexed(dir, slug), dir + "/" + slug).toBe(false)
      }
    }
  })

  it("keeps the noindex manifest summary and per-directory partitions consistent", () => {
    const manifest = JSON.parse(fs.readFileSync("noindex-list.json", "utf8")) as {
      summary: { totalFiles: number; totalKeep: number; totalNoindex: number }
      directories: Record<string, { total: number; keep?: string[]; noindex?: string[] }>
    }
    const directories = Object.values(manifest.directories)
    const totalFiles = directories.reduce((sum, dir) => sum + dir.total, 0)
    const totalKeep = directories.reduce((sum, dir) => sum + (dir.keep?.length ?? 0), 0)
    const totalNoindex = directories.reduce((sum, dir) => sum + (dir.noindex?.length ?? 0), 0)

    expect(manifest.summary).toMatchObject({ totalFiles, totalKeep, totalNoindex })
    for (const [name, dir] of Object.entries(manifest.directories)) {
      const keep = dir.keep ?? []
      const noindex = dir.noindex ?? []
      expect(new Set(keep).size, name + " duplicate keep slugs").toBe(keep.length)
      expect(new Set(noindex).size, name + " duplicate noindex slugs").toBe(noindex.length)
      expect(keep.filter((slug) => noindex.includes(slug)), name + " keep/noindex overlap").toEqual([])
      expect(dir.total, name + " partition count").toBe(keep.length + noindex.length)
    }
  })

  it("keeps real content discoverable in the sitemap", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname)
    for (const path of [
      "/reviews/linear",
      "/comparisons/ahrefs-vs-moz",
      "/comparisons/activecampaign-vs-adobe-express",
      "/guides/agile-transformation-guide",
      "/glossary/dashboard",
      "/alternatives/slack-alternatives",
      "/best/best-crm-software",
      "/use-cases/best-crm-for-small-business",
    ]) {
      expect(paths, path).toContain(path)
    }
  })

  it("does not let utility pages become indexable", () => {
    expect((searchMetadata as { robots?: unknown }).robots).toMatchObject({ index: false })
    expect((dashboardMetadata as { robots?: unknown }).robots).toMatchObject({ index: false })
  })

  it("keeps the public editorial team author page indexable", async () => {
    const { isPublicAuthor } = await import("@/lib/authors")
    const { generateMetadata } = await import("@/app/authors/[slug]/page")
    expect(isPublicAuthor("pilotstack-team")).toBe(true)
    const meta = await generateMetadata({ params: Promise.resolve({ slug: "pilotstack-team" }) })
    expect((meta as { robots?: { index?: boolean; follow?: boolean } }).robots).toMatchObject({ index: true, follow: true })
  })

  it("keeps the quality manifest free of legacy noindex suppressions", async () => {
    const fs = await import("node:fs/promises")
    const manifest = JSON.parse(await fs.readFile("noindex-list.json", "utf8"))
    expect(manifest.summary.totalNoindex).toBe(0)
    for (const [dir, data] of Object.entries(manifest.directories as Record<string, { noindex?: string[] }>)) {
      expect(data.noindex ?? [], dir).toEqual([])
    }
  })

  it("uses the canonical apex host in sitemap URLs", () => {
    const paths = sitemap()
    expect(paths.length).toBeGreaterThan(0)
    for (const entry of paths.slice(0, 20)) expect(entry.url.startsWith(SITE)).toBe(true)
  })
})
