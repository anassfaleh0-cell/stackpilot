import { describe, expect, it } from "vitest"
import { getAllComparisons, getComparison, isContentAvailable } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import fs from "node:fs"
import path from "node:path"

const unpublishedComparisons = [
  "1password-vs-appwrite",
  "1password-vs-auth0",
  "1password-vs-crowdstrike",
  "1password-vs-fathom",
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

describe("unpublished comparison records", () => {
  it("does not resolve unpublished records as public comparison pages", () => {
    for (const slug of unpublishedComparisons) {
      const record = JSON.parse(fs.readFileSync(`content/comparisons/${slug}.json`, "utf8")) as { publicationStatus?: string }
      expect(record.publicationStatus, slug).toBe("draft")
      expect(getComparison(slug), slug).toBeNull()
      expect(isContentAvailable("comparison", slug), slug).toBe(false)
      expect(isNoindexed("comparisons", slug), slug).toBe(false)
    }
  })

  it("excludes unpublished comparisons from public listing and sitemap data", () => {
    const publicSlugs = new Set(getAllComparisons().map((comparison) => comparison.slug))
    for (const slug of unpublishedComparisons) {
      expect(publicSlugs.has(slug), slug).toBe(false)
    }
  })

  it("preserves a permanent product-review redirect for every retired comparison URL", () => {
    const config = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")
    const redirectBlocks = [...config.matchAll(/source:\s*"([^"]+)"[\s\S]*?destination:\s*"([^"]+)"[\s\S]*?permanent:\s*true/g)]
    const redirects = new Map(redirectBlocks.map((match) => [match[1], match[2]]))

    for (const slug of unpublishedComparisons) {
      const source = `/comparisons/${slug}`
      expect(redirects.has(source), `${source} must redirect instead of becoming a 404`).toBe(true)
      expect(redirects.get(source), `${source} should point to a relevant product review`).toMatch(/^\/reviews\/[a-z0-9-]+$/)
    }
  })
})
