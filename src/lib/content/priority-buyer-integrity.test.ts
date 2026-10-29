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

  it("retains Stripe's provisional score and documents eligible payment flows", () => {
    const review = read("reviews", "stripe")
    expect(review.rating).toBe(4.7)
    expect(review.ratingVerified).toBe(false)
    expect(review.content.some((section: AnyRecord) => section.body.includes("docs.stripe.com/connect"))).toBe(true)
    expect(review.whoShouldNotUse).toContain("eligible account")
    expect(review.features.find((feature: AnyRecord) => feature.name === "Connect Platform").description).toContain("docs.stripe.com/connect")
  })
})
