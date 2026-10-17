import { describe, expect, it } from "vitest"
import sitemap from "@/app/sitemap"
import { filterSitemapEntries, isRetiredComparisonSlug, RETIRED_COMPARISON_SLUGS } from "./retired-comparisons"

describe("retired comparison sitemap filtering", () => {
  it("recognizes known legacy comparison redirects", () => {
    expect(isRetiredComparisonSlug("activecampaign-vs-chatgpt")).toBe(true)
    expect(isRetiredComparisonSlug("activecampaign-vs-fathom")).toBe(true)
  })

  it("filters every registered retired slug, not just representative examples", () => {
    const entries = [...RETIRED_COMPARISON_SLUGS].map((slug) => ({
      url: `https://pilotstack.online/comparisons/${slug}`,
      priority: 0.7,
    }))
    expect(RETIRED_COMPARISON_SLUGS.size).toBeGreaterThan(0)
    expect(filterSitemapEntries(entries)).toEqual([])
  })

  it("keeps retired comparison redirects out of sitemap entries", () => {
    const entries = [
      { url: "https://pilotstack.online/comparisons/activecampaign-vs-chatgpt", priority: 0.7 },
      { url: "https://pilotstack.online/comparisons/activecampaign-vs-fathom", priority: 0.7 },
      { url: "https://pilotstack.online/comparisons/zoom-vs-webex", priority: 0.8 },
      { url: "https://pilotstack.online/reviews/activecampaign", priority: 0.8 },
    ]
    expect(filterSitemapEntries(entries).map((entry) => entry.url)).toEqual([
      "https://pilotstack.online/comparisons/zoom-vs-webex",
      "https://pilotstack.online/reviews/activecampaign",
    ])
  })

  it("removes duplicate URLs without removing distinct entries", () => {
    const entries = [
      { url: "https://pilotstack.online/reviews/linear", priority: 0.8 },
      { url: "https://pilotstack.online/reviews/linear", priority: 0.7 },
      { url: "https://pilotstack.online/reviews/asana", priority: 0.8 },
    ]
    expect(filterSitemapEntries(entries)).toEqual([entries[0], entries[2]])
  })

  it("rejects malformed sitemap URLs", () => {
    expect(filterSitemapEntries([{ url: "not a URL" }])).toEqual([])
  })

  it("deduplicates trailing-slash variants and rejects query or fragment URLs", () => {
    const entries = [
      { url: "https://pilotstack.online/reviews/linear", priority: 0.8 },
      { url: "https://pilotstack.online/reviews/linear/", priority: 0.7 },
      { url: "https://pilotstack.online/reviews/asana?ref=nav", priority: 0.8 },
      { url: "https://pilotstack.online/reviews/notion#pricing", priority: 0.8 },
      { url: "https://pilotstack.online/reviews/asana", priority: 0.8 },
    ]
    expect(filterSitemapEntries(entries)).toEqual([entries[0], entries[4]])
  })
})


describe("generated sitemap integration", () => {
  it("excludes every retired comparison URL from the actual sitemap output", () => {
    const urls = new Set(sitemap().map((entry) => entry.url))
    for (const slug of RETIRED_COMPARISON_SLUGS) {
      expect(urls.has(`https://pilotstack.online/comparisons/${slug}`), slug).toBe(false)
    }
  })
})
