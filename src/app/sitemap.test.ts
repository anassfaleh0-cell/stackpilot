import { describe, expect, it } from "vitest"
import sitemap from "@/app/sitemap"
import { siteConfig } from "@/lib/constants"

describe("XML sitemap integrity", () => {
  it("does not list explicitly unpublished comparison records", () => {
    const paths = sitemap().map((entry) => new URL(entry.url).pathname)
    expect(paths).not.toContain("/comparisons/square-vs-xero")
  })

  it("uses only absolute URLs on the canonical site origin", () => {
    const entries = sitemap()
    const origin = new URL(siteConfig.url).origin

    expect(entries.length).toBeGreaterThan(0)
    for (const entry of entries) {
      const url = new URL(entry.url)
      expect(url.origin, entry.url).toBe(origin)
      expect(url.hash, entry.url).toBe("")
      expect(url.username, entry.url).toBe("")
      expect(url.password, entry.url).toBe("")
    }
  })

  it("does not list the RSS feed as an indexable page", () => {
    const urls = sitemap().map((entry) => new URL(entry.url).pathname)
    expect(urls).not.toContain("/rss.xml")
  })

  it("does not emit duplicate URLs", () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it("uses valid lastModified values when provided", () => {
    for (const entry of sitemap()) {
      if (entry.lastModified === undefined) continue
      const date = entry.lastModified instanceof Date
        ? entry.lastModified
        : new Date(entry.lastModified)
      expect(Number.isNaN(date.getTime()), entry.url).toBe(false)
    }
  })
})
