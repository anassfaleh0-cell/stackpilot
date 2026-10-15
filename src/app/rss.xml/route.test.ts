import { describe, expect, it } from "vitest"
import { GET } from "@/app/rss.xml/route"
import { isContentAvailable } from "@/lib/content/registry"

const ROUTE_TYPES = {
  reviews: "review",
  comparisons: "comparison",
  guides: "guide",
  blog: "blog",
  research: "research",
} as const

describe("RSS feed", () => {
  it("returns a cacheable RSS 2.0 document with the expected content type", async () => {
    const response = await GET()
    const xml = await response.text()

    expect(response.status).toBe(200)
    expect(response.headers.get("content-type")).toContain("application/rss+xml")
    expect(response.headers.get("cache-control")).toContain("max-age=3600")
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>')
    expect(xml).toContain('<rss version="2.0"')
    expect(xml).toContain("<channel>")
    expect(xml).toContain("</channel>")
  })

  it("only publishes item URLs backed by available content records", async () => {
    const response = await GET()
    const xml = await response.text()
    const itemLinks = [...xml.matchAll(/<item>[\s\S]*?<link>(https?:\/\/[^<]+)<\/link>[\s\S]*?<\/item>/g)]

    expect(itemLinks.length).toBeGreaterThan(0)

    for (const match of itemLinks) {
      const url = new URL(match[1])
      const [, route, slug] = url.pathname.split("/")
      const type = ROUTE_TYPES[route]
      if (!type || !slug) throw new Error("unexpected RSS route: " + url.pathname)
      expect(isContentAvailable(type, slug), "RSS item points to unavailable content: " + url.pathname).toBe(true)
    }
  })

  it("keeps HTML content inside CDATA and safely escapes XML text fields", async () => {
    const response = await GET()
    const xml = await response.text()

    expect(xml).toContain("<content:encoded><![CDATA[<p>")
    expect(xml).toContain("</p>]]></content:encoded>")
    expect(xml).not.toMatch(/<description>[^<]*&(?!amp;|lt;|gt;|quot;|apos;)/)
  })
})
