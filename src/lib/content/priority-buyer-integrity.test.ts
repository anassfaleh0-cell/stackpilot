import { describe, expect, it } from "vitest"
import fs from "node:fs"
import path from "node:path"

type AnyRecord = Record<string, any>
const read = (category: string, slug: string): AnyRecord =>
  JSON.parse(fs.readFileSync(path.join(process.cwd(), "content", category, slug + ".json"), "utf8"))

describe("priority buying guides retain editorial integrity", () => {
  it("distinguishes sales CRM candidates from Freshdesk support ticketing without erasing scores", () => {
    const crm = read("best", "best-crm-sales-small-business")
    const freshdesk = crm.picks.find((pick: AnyRecord) => pick.toolSlug === "freshdesk")
    expect(freshdesk?.bestFor).toMatch(/not a direct replacement for sales pipeline/i)
    expect(crm.reviewedBody).toContain("support helpdesk")
    expect(crm.reviewedBody).toContain("freshworks.com/helpdesk/software/crm/")
    expect(crm.body).toContain("Best CRM & Sales Software")
    expect(crm.picks).toHaveLength(6)
    expect(crm.picks.every((pick: AnyRecord) => typeof pick.rating === "number")).toBe(true)
  })

  it("distinguishes accounting ledgers from merchant-of-record and storefront systems", () => {
    const startup = read("use-cases", "best-accounting-for-startups")
    expect(startup.recommendations.some((pick: AnyRecord) => pick.toolSlug === "xero")).toBe(true)
    expect(startup.recommendations.find((pick: AnyRecord) => pick.toolSlug === "paddle").bestFor).toMatch(/not an accounting system/i)
    expect(startup.recommendations.find((pick: AnyRecord) => pick.toolSlug === "shopify").bestFor).toMatch(/not a standalone bookkeeping substitute/i)
    expect(startup.body).toContain("month-end close")
    expect(startup.recommendations.every((pick: AnyRecord) => typeof pick.rating === "number")).toBe(true)
  })

  it("retains Jotform's provisional rating while correcting unsupported technical certainty", () => {
    const review = read("reviews", "jotform")
    expect(review.rating).toBe(4.2)
    expect(review.content.some((section: AnyRecord) => section.body.includes("jotform.com/help/408"))).toBe(true)
    const encryption = review.features.find((feature: AnyRecord) => feature.name === "Data Encryption")
    expect(encryption.description).toContain("not independently verified")
    expect(review.whoShouldUse).not.toMatch(/enterprises and power users/i)
  })

  it("keeps SEO category links connected to relevant buyer resources", () => {
    const seo = read("categories", "marketing-seo")
    const links = new Set(seo.internalLinks.map((link: AnyRecord) => link.href))
    expect(links.has("/comparisons/ahrefs-vs-moz")).toBe(true)
    expect(links.has("/use-cases/best-seo-for-agencies")).toBe(true)
    expect(links.has("/best/best-marketing-seo-enterprise")).toBe(true)
    expect(links.has("/blog/best-seo-tools-for-agencies")).toBe(true)
  })

  it("distinguishes CRM and HR buyer needs without claiming universal fit", () => {
    const crm = read("categories", "crm-sales")
    const hr = read("categories", "hr-people")
    expect(crm.faqs.find((faq: AnyRecord) =>
      faq.question.includes("sales engagement")).answer).toContain("Freshdesk")
    expect(hr.faqs.find((faq: AnyRecord) =>
      faq.question.includes("AI being used")).answer).toContain("human oversight")
    expect(hr.faqs.find((faq: AnyRecord) =>
      faq.question.includes("applicant tracking")).answer).toContain("jurisdiction")
  })

  it("does not advertise discontinued Integromat as a separate current tool", () => {
    const automation = read("use-cases", "best-automation-for-business")
    const legacy = automation.recommendations.find((pick: AnyRecord) => pick.toolSlug === "integromat")
    expect(legacy).toBeDefined()
    expect(legacy.bestFor).toContain("shut down")
    expect(automation.faqs[0].answer).toContain("September 30, 2023")
    expect(automation.body).toContain("make.com/end-of-integromat")
    expect(automation.selectionCriteria.some((item: AnyRecord) =>
      item.factor === "Failure handling and recovery")).toBe(true)
  })

  it("preserves analytics selections while separating product, web and BI use cases", () => {
    const analytics = read("best", "best-enterprise-analytics")
    expect(analytics.picks.length).toBeGreaterThanOrEqual(8)
    expect(analytics.reviewedBody).toContain("Business intelligence and reporting")
    expect(analytics.reviewedBody).toContain("Digital-experience diagnostics")
    expect(analytics.reviewedBody).toContain("learn.microsoft.com/en-us/power-bi/desktop-rls")
    expect(analytics.criteria.length).toBeGreaterThanOrEqual(6)
  })

  it("keeps the Linear provisional rating and source-backed planning guidance", () => {
    const linear = read("reviews", "linear")
    expect(linear.rating).toBe(4.8)
    expect(linear.ratingVerified).toBe(false)
    expect(linear.content.some((section: AnyRecord) => section.body.includes("linear.app/docs/use-cycles"))).toBe(true)
    expect(linear.content.some((section: AnyRecord) => section.body.includes("linear.app/docs/initiatives"))).toBe(true)
  })

  it("preserves Moz's stored score while replacing unsupported ranking claims with vendor documentation", () => {
    const moz = read("reviews", "moz")
    expect(moz.rating).toBe(4.3)
    expect(moz.content.some((section: AnyRecord) => section.body.includes("moz.com/help"))).toBe(true)
    expect(moz.pros.some((statement: string) => /SOC 2|ISO 27001/i.test(statement))).toBe(false)
    expect(moz.faqs.some((faq: AnyRecord) => faq.question === "Is Domain Authority a Google metric?")).toBe(true)
  })

  it("retains Stripe's provisional score and documents eligible payment flows", () => {
    const review = read("reviews", "stripe")
    expect(review.rating).toBe(4.7)
    expect(review.ratingVerified).toBe(false)
    expect(review.content.some((section: AnyRecord) => section.body.includes("docs.stripe.com/connect"))).toBe(true)
    expect(review.whoShouldNotUse).toContain("eligible account")
    expect(review.features.find((feature: AnyRecord) => feature.name === "Connect Platform").description).toContain("docs.stripe.com/connect")
  })
})
