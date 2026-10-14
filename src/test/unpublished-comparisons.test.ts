import { describe, expect, it } from "vitest"
import { getAllComparisons, getComparison, isContentAvailable } from "@/lib/content/registry"
import { isNoindexed } from "@/lib/noindex"
import fs from "node:fs"
import path from "node:path"

const unpublishedComparisons = [
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
  it("keeps the ActiveCampaign and Adobe Express workflow guide publicly available", () => {
    const record = JSON.parse(fs.readFileSync("content/comparisons/activecampaign-vs-adobe-express.json", "utf8")) as { published?: boolean; winner?: string | null; winnerVerified?: boolean; featuresVerified?: boolean; lastUpdated?: string }
    expect(record.published).toBe(true)
    expect(record.winner).toBeNull()
    expect(record.winnerVerified).toBe(false)
    expect(record.featuresVerified).toBe(false)
    expect(record.lastUpdated).toBe("2026-10-14")
    expect(getComparison("activecampaign-vs-adobe-express")).not.toBeNull()
    expect(isContentAvailable("comparison", "activecampaign-vs-adobe-express")).toBe(true)
    const config = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")
    expect(config).not.toContain('source: "/comparisons/activecampaign-vs-adobe-express"')
  })

  it("keeps rewritten 1Password vs Fathom Analytics publicly available and indexable", () => {
    const record = JSON.parse(fs.readFileSync("content/comparisons/1password-vs-fathom.json", "utf8")) as { published?: boolean; publicationStatus?: string; winner?: string | null; winnerVerified?: boolean; featuresVerified?: boolean }
    expect(record.published).toBe(true)
    expect(record.publicationStatus).not.toBe("draft")
    expect(record.tool2).toBe("Fathom Analytics")
    expect(record.winner).toBeNull()
    expect(record.winnerVerified).toBe(false)
    expect(record.featuresVerified).toBe(false)
    expect(getComparison("1password-vs-fathom")).not.toBeNull()
    expect(isContentAvailable("comparison", "1password-vs-fathom")).toBe(true)
    const config = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")
    expect(config).not.toContain('source: "/comparisons/1password-vs-fathom"')
  })

  it("keeps rewritten 1Password vs CrowdStrike publicly available and indexable", () => {
    const record = JSON.parse(fs.readFileSync("content/comparisons/1password-vs-crowdstrike.json", "utf8")) as { published?: boolean; publicationStatus?: string; winner?: string | null; winnerVerified?: boolean; featuresVerified?: boolean }
    expect(record.published).toBe(true)
    expect(record.publicationStatus).not.toBe("draft")
    expect(record.winner).toBeNull()
    expect(record.winnerVerified).toBe(false)
    expect(record.featuresVerified).toBe(false)
    expect(getComparison("1password-vs-crowdstrike")).not.toBeNull()
    expect(isContentAvailable("comparison", "1password-vs-crowdstrike")).toBe(true)
    const config = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")
    expect(config).not.toContain('source: "/comparisons/1password-vs-crowdstrike"')
  })

  it("keeps rewritten 1Password vs Appwrite publicly available and indexable", () => {
    const record = JSON.parse(fs.readFileSync("content/comparisons/1password-vs-appwrite.json", "utf8")) as { published?: boolean; publicationStatus?: string; winner?: string | null; winnerVerified?: boolean; featuresVerified?: boolean }
    expect(record.published).toBe(true)
    expect(record.publicationStatus).not.toBe("draft")
    expect(record.winner).toBeNull()
    expect(record.winnerVerified).toBe(false)
    expect(record.featuresVerified).toBe(false)
    expect(getComparison("1password-vs-appwrite")).not.toBeNull()
    expect(isContentAvailable("comparison", "1password-vs-appwrite")).toBe(true)
    const config = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")
    expect(config).not.toContain('source: "/comparisons/1password-vs-appwrite"')
  })

  it("keeps rewritten 1Password vs Auth0 publicly available and indexable", () => {
    const record = JSON.parse(fs.readFileSync("content/comparisons/1password-vs-auth0.json", "utf8")) as { published?: boolean; publicationStatus?: string; winner?: string | null; winnerVerified?: boolean; featuresVerified?: boolean }
    expect(record.published).toBe(true)
    expect(record.publicationStatus).not.toBe("draft")
    expect(record.winner).toBeNull()
    expect(record.winnerVerified).toBe(false)
    expect(record.featuresVerified).toBe(false)
    expect(getComparison("1password-vs-auth0")).not.toBeNull()
    expect(isContentAvailable("comparison", "1password-vs-auth0")).toBe(true)
    const config = fs.readFileSync(path.join(process.cwd(), "next.config.ts"), "utf8")
    expect(config).not.toContain('source: "/comparisons/1password-vs-auth0"')
  })

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
