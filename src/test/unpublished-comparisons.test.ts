import { describe, expect, it } from "vitest"
import { getComparison, isContentAvailable } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import fs from "node:fs"
import path from "node:path"

const rewrittenSlugs = [
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
const previouslyRestoredSlugs = [
  "1password-vs-appwrite",
  "1password-vs-auth0",
  "1password-vs-crowdstrike",
  "1password-vs-fathom",
  "activecampaign-vs-adobe-express",
]
const config = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")

describe("rewritten cross-category comparison guides", () => {
  it("keeps every rewritten guide published, available, indexable, and free of fabricated winner claims", () => {
    for (const slug of rewrittenSlugs) {
      const file = path.join(process.cwd(), "content", "comparisons", `${slug}.json`)
      const record = JSON.parse(fs.readFileSync(file, "utf8")) as { published?: boolean; publicationStatus?: string; winner?: string | null; winnerVerified?: boolean; featuresVerified?: boolean; decisionGuide?: boolean; lastUpdated?: string }
      expect(record.published, slug).toBe(true)
      expect(record.publicationStatus, slug).not.toBe("draft")
      expect(record.winner, slug).toBeNull()
      expect(record.winnerVerified, slug).toBe(false)
      expect(record.featuresVerified, slug).toBe(false)
      expect(record.decisionGuide, slug).toBe(true)
      expect(record.lastUpdated, slug).toBeUndefined()
      expect(getComparison(slug), slug).not.toBeNull()
      expect(isContentAvailable("comparison", slug), slug).toBe(true)
      expect(isNoindexed("comparisons", slug), slug).toBe(false)
      expect(config, slug).not.toContain(`source: "/comparisons/${slug}"`)
    }
  })

  it("preserves already-rewritten guides as public and indexable", () => {
    for (const slug of previouslyRestoredSlugs) {
      const record = JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", "comparisons", `${slug}.json`), "utf8")) as { published?: boolean; publicationStatus?: string; winner?: string | null; winnerVerified?: boolean; featuresVerified?: boolean }
      expect(record.published, slug).toBe(true)
      expect(record.publicationStatus, slug).not.toBe("draft")
      expect(record.winner, slug).toBeNull()
      expect(record.winnerVerified, slug).toBe(false)
      expect(record.featuresVerified, slug).toBe(false)
      expect(getComparison(slug), slug).not.toBeNull()
      expect(isContentAvailable("comparison", slug), slug).toBe(true)
      expect(isNoindexed("comparisons", slug), slug).toBe(false)
      expect(config, slug).not.toContain(`source: "/comparisons/${slug}"`)
    }
  })
})
