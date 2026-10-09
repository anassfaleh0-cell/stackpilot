import { describe, expect, it } from "vitest"
import { isNoindexed } from "@/lib/noindex"
import { getComparison, getGuide } from "@/lib/content/registry"

describe("content indexability guards", () => {
  it("honors the explicit noindex manifest", () => {
    expect(isNoindexed("guides", "api-security-best-practices")).toBe(true)
    expect(isNoindexed("guides", "not-a-real-guide")).toBe(false)
  })

  it("does not expose a comparison explicitly marked unpublished", () => {
    expect(getComparison("activecampaign-vs-adobe-express")).toBeNull()
    expect(getComparison("adp-vs-airtable")).toBeNull()
  })
})

const rewrittenGuideSlugs = [
  "marketing-attribution-guide",
  "software-evaluation-framework",
  "project-management-software-buyers-guide",
  "api-development-tools-guide",
  "crm-selection-guide",
  "crm-migration-checklist",
  "marketing-automation-buyers-guide",
  "data-governance-guide",
  "vendor-risk-assessment",
  "software-cost-analysis",
  "application-monitoring-guide",
  "business-intelligence-platform-guide",
  "privacy-analytics-guide",
  "product-analytics-implementation",
  "error-tracking-best-practices",
  "identity-management-platform-guide",
  "endpoint-security-solutions-guide",
  "devsecops-implementation",
]

describe("rewritten guide quality floor", () => {
  for (const slug of rewrittenGuideSlugs) {
    it(`${slug} has substantive sections and relevant tools`, () => {
      const guide = getGuide(slug)
      expect(guide).not.toBeNull()
      expect(guide!.sections.length).toBeGreaterThanOrEqual(7)
      const words = guide!.sections.reduce((total, section) => total + section.body.split(/\\s+/).filter(Boolean).length + (section.items || []).join(" ").split(/\\s+/).filter(Boolean).length, 0)
      expect(words).toBeGreaterThanOrEqual(500)
      expect(guide!.relatedTools.length).toBeGreaterThan(0)
    })
  }
})
