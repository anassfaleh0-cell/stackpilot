import { describe, expect, it } from "vitest"
import { isNoindexed } from "@/lib/noindex"
import { getAlternative, getBest, getBlogPost, getComparison, getGuide, getHub, getIndustry, getResearch, getReview, getStatistic, getUseCase } from "@/lib/content/registry"

describe("content indexability guards", () => {
  it("honors the explicit noindex manifest", () => {
    expect(isNoindexed("guides", "api-security-best-practices")).toBe(true)
    expect(isNoindexed("guides", "not-a-real-guide")).toBe(false)
    expect(isNoindexed("reviews", "asana")).toBe(true)
    expect(isNoindexed("reviews", "linear")).toBe(false)
    expect(isNoindexed("reviews", "quickbooks")).toBe(false)
    expect(isNoindexed("reviews", "zoom")).toBe(false)
    expect(isNoindexed("reviews", "webex")).toBe(false)
    expect(isNoindexed("best", "best-ai-coding-tools")).toBe(true)
    expect(isNoindexed("best", "best-accounting-software")).toBe(false)
    expect(isNoindexed("alternatives", "1password-alternatives")).toBe(true)
    expect(isNoindexed("alternatives", "notion-alternatives")).toBe(false)
    expect(isNoindexed("blog", "accounting-software-cost-2026")).toBe(false)
    expect(isNoindexed("blog", "software-review-methodology")).toBe(true)
    expect(isNoindexed("research", "ai-adoption-report-2026")).toBe(true)
    expect(isNoindexed("statistics", "advertising-software")).toBe(true)
    expect(isNoindexed("use-cases", "best-accounting-for-enterprise")).toBe(true)
    expect(isNoindexed("industries", "aerospace")).toBe(true)
    expect(isNoindexed("hubs", "software-for-agencies")).toBe(true)
  })

  it("does not expose a comparison explicitly marked unpublished", () => {
    expect(getComparison("activecampaign-vs-adobe-express")).toBeNull()
    expect(getComparison("adp-vs-airtable")).toBeNull()
    expect(getComparison("zoom-vs-webex")).not.toBeNull()
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
  for (const slug of ["linear", "notion", "clickup", "quickbooks", "xero", "freshbooks", "zoom", "webex"]) {
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

describe("rewritten alternative-page quality floor", () => {
  for (const slug of ["linear-alternatives", "notion-alternatives", "clickup-alternatives"]) {
    it(`${slug} has relevant alternatives and actionable selection guidance`, () => {
      const page = getAlternative(slug)
      expect(page).not.toBeNull()
      expect(page!.alternatives.length).toBeGreaterThanOrEqual(5)
      expect(page!.selectionCriteria.length).toBeGreaterThanOrEqual(5)
      expect(page!.sections.map((section) => section.body).join(" ").split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(300)
    })
  }
  it("does not recommend scheduling and task-list tools as Notion workspace alternatives", () => {
    const page = getAlternative("notion-alternatives")
    expect(page!.alternatives.map((item) => item.name)).not.toContain("Calendly")
    expect(page!.alternatives.map((item) => item.name)).not.toContain("Todoist")
  })
})

describe("rewritten blog quality floor", () => {
  for (const slug of ["accounting-software-cost-2026", "accounts-payable-automation", "agile-vs-waterfall-software"]) {
    it(`${slug} has substantive original content without runtime padding`, () => {
      const post = getBlogPost(slug)
      expect(post).not.toBeNull()
      expect(post!.body.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(700)
      expect(post!.body).not.toMatch(/This topic is most useful when it is connected to a real decision/)
    })
  }
  it("does not expose unrewritten blog posts through the public registry", () => {
    expect(getBlogPost("software-review-methodology")).toBeNull()
  })
})

describe("quarantined evidence-sensitive content", () => {
  it("does not expose unsourced research, statistics, or unreviewed use cases", () => {
    expect(getResearch("ai-adoption-report-2026")).toBeNull()
    expect(getStatistic("advertising-software")).toBeNull()
    expect(getUseCase("best-accounting-for-enterprise")).toBeNull()
    expect(getIndustry("aerospace")).toBeNull()
    expect(getHub("software-for-agencies")).toBeNull()
  })
})
