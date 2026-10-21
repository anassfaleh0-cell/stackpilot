import { describe, expect, it } from "vitest"
import sitemap from "@/app/sitemap"
import { filterSitemapEntries, isRetiredComparisonSlug, RETIRED_COMPARISON_SLUGS } from "./retired-comparisons"

const restoredSlugs = [
  "affinity-vs-wix",
  "dialpad-vs-loom",
  "adp-vs-airtable",
  "clickup-vs-gusto",
  "ahrefs-vs-claude",
  "copy-ai-vs-heap",
  "cal-com-vs-discord",
  "auth0-vs-bitbucket",
  "bitwarden-vs-circleci",
  "bitwarden-vs-google-analytics",
  "canva-vs-cloudflare-pages",
  "cloudflare-pages-vs-crowdstrike",
  "cloudflare-pages-vs-copy-ai",
  "freshbooks-vs-greenhouse",
  "appwrite-vs-chatgpt",
  "bitbucket-vs-claude",
  "circleci-vs-copilot",
  "crowdstrike-vs-heap",
  "expensify-vs-fullstory",
  "freshbooks-vs-google-analytics",
  "freshdesk-vs-google-meet",
  "copper-crm-vs-discord",
  "gusto-vs-paddle",
  "convertkit-vs-copilot",
  "activecampaign-vs-chatgpt",
  "activecampaign-vs-fathom",
  "adobe-xd-vs-ahrefs",
  "ahrefs-vs-copper-crm",
  "ahrefs-vs-fullstory",
  "bigcommerce-vs-fathom",
  "chatgpt-vs-fathom",
  "copilot-vs-google-analytics",
  "convertkit-vs-google-analytics",
  "freshsales-vs-microsoft-teams",
  "heap-vs-paddle",
  "convertkit-vs-freshdesk",
  "canva-vs-mailchimp",
  "acuity-vs-airtable",
  "asana-vs-cal-com",
  "basecamp-vs-calendly",
  "calendly-vs-google-meet",
  "copy-ai-vs-mailchimp",
  "evernote-vs-microsoft-teams",
  "heap-vs-mailchimp",
  "claude-vs-fullstory",
]

describe("public comparison sitemap integrity", () => {
  it("does not classify restored guides as retired", () => {
    expect(RETIRED_COMPARISON_SLUGS.size).toBe(0)
    for (const slug of restoredSlugs) expect(isRetiredComparisonSlug(slug), slug).toBe(false)
  })

  it("includes all restored comparison guides in the generated sitemap", () => {
    const urls = new Set(sitemap().map((entry) => entry.url))
    for (const slug of restoredSlugs) expect(urls.has(`https://pilotstack.online/comparisons/${slug}`), slug).toBe(true)
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
