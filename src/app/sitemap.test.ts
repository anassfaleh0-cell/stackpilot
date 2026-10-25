import { describe, expect, it } from "vitest"
import sitemap from "@/app/sitemap"
import { siteConfig } from "@/lib/constants"
import { REDIRECTED_ALTERNATIVE_SLUGS, REDIRECTED_BEST_SLUGS, REDIRECTED_GUIDE_SLUGS, REDIRECTED_REVIEW_SLUGS } from "@/lib/sitemap/redirected-content"
import fs from "node:fs"
import path from "node:path"

describe("XML sitemap integrity", () => {
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

  it("does not advertise known permanent-redirect source URLs in the sitemap", () => {
    const paths = new Set(sitemap().map((entry) => new URL(entry.url).pathname))
    for (const slug of REDIRECTED_ALTERNATIVE_SLUGS) {
      expect(paths.has(`/alternatives/${slug}`), slug).toBe(false)
    }
    for (const slug of REDIRECTED_BEST_SLUGS) {
      expect(paths.has(`/best/${slug}`), slug).toBe(false)
    }
    for (const slug of REDIRECTED_GUIDE_SLUGS) {
      expect(paths.has(`/guides/${slug}`), slug).toBe(false)
    }
    for (const slug of REDIRECTED_REVIEW_SLUGS) {
      expect(paths.has(`/reviews/${slug}`), slug).toBe(false)
    }
  })

  it("does not emit duplicate URLs", () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(new Set(urls).size).toBe(urls.length)
  })

  it("does not use legacy published booleans to silently suppress public content routes", () => {
    const paths = new Set(sitemap().map((entry) => new URL(entry.url).pathname))
    const legacyPublicExamples = [
      "/alternatives/1password-alternatives",
      "/alternatives/slack-alternatives",
      "/best/best-ai-machine-learning-agencies",
    ]
    for (const route of legacyPublicExamples) {
      expect(paths.has(route), `${route} must remain discoverable while its content is repaired in place`).toBe(true)
    }
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
