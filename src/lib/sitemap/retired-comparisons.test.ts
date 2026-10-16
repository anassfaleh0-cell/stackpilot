import { describe, expect, it } from "vitest"
import { filterSitemapEntries, isRetiredComparisonSlug } from "./retired-comparisons"

describe("retired comparison sitemap filtering", () => {
  it("recognizes known legacy comparison redirects", () => {
    expect(isRetiredComparisonSlug("activecampaign-vs-chatgpt")).toBe(true)
    expect(isRetiredComparisonSlug("activecampaign-vs-fathom")).toBe(true)
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
})
