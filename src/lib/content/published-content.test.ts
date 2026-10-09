import { describe, expect, it } from "vitest"
import { isNoindexed } from "@/lib/noindex"
import { getBest, getComparison, getGuide, getReview } from "@/lib/content/registry"

describe("content indexability guards", () => {
  it("honors the explicit noindex manifest", () => {
    expect(isNoindexed("guides", "api-security-best-practices")).toBe(true)
    expect(isNoindexed("guides", "not-a-real-guide")).toBe(false)
    expect(isNoindexed("reviews", "asana")).toBe(true)
    expect(isNoindexed("reviews", "linear")).toBe(false)
    expect(isNoindexed("best", "best-ai-coding-tools")).toBe(true)
    expect(isNoindexed("best", "best-accounting-software")).toBe(false)
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
  "saas-procurement-guide",
  "cloud-migration-planning",
  "password-management-enterprise-guide",
  "team-collaboration-tools-guide",
  "remote-work-software-stack",
  "total-cost-ownership-saas",
]

describe("rewritten guide quality floor", () => {
  for (const slug of rewrittenGuideSlugs) {
    it(`${slug} has substantive sections and relevant tools`, () => {
      const guide = getGuide(slug)
      expect(guide).not.toBeNull()
      expect(guide!.sections.length).toBeGreaterThanOrEqual(7)
      const words = guide!.sections.reduce((total, section) => total + section.body.split(/\s+/).filter(Boolean).length + (section.items || []).join(" ").split(/\s+/).filter(Boolean).length, 0)
      expect(words).toBeGreaterThanOrEqual(500)
      expect(guide!.relatedTools.length).toBeGreaterThan(0)
    })
  }
})

describe("rewritten review quality floor", () => {
  for (const slug of ["linear", "notion", "clickup"]) {
    it(`${slug} review avoids unsupported review-count claims and has substantive guidance`, () => {
      const review = getReview(slug)
      expect(review).not.toBeNull()
      const body = review!.content.map((section) => section.body).join(" ")
      expect(body.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(500)
      expect(body).not.toMatch(/across\s+[\d,]+\s+(?:user\s+)?reviews/i)
      expect(body).not.toMatch(/sub-100ms|tested for at least two weeks|our expert team evaluated/i)
    })
  }
})

describe("rewritten best-page quality floor", () => {
  for (const slug of ["best-accounting-software", "best-agile-project-management"]) {
    it(`${slug} has specific criteria and actionable vendor trade-offs`, () => {
      const page = getBest(slug)
      expect(page).not.toBeNull()
      expect(page!.criteria.length).toBeGreaterThanOrEqual(5)
      expect(page!.picks.length).toBeGreaterThanOrEqual(3)
      expect(page!.faqs.length).toBeGreaterThanOrEqual(5)
      expect(page!.picks.every((pick) => pick.bestFor.length > 30 && pick.pros.length > 0 && pick.cons.length > 0)).toBe(true)
    })
  }
})
