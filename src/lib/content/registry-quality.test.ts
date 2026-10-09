import { describe, expect, it } from "vitest"
import { getBest, getGuide } from "@/lib/content/registry"

describe("content quality repairs", () => {
  it("replaces repetitive generated guide filler with practical buyer guidance", () => {
    const guide = getGuide("marketing-attribution-guide")
    expect(guide).not.toBeNull()
    expect(guide?.sections[0]?.title).toBe("Define the Decision")
    expect(guide?.description).toContain("A practical guide to marketing attribution")
    expect(guide?.description).not.toContain("Choosing the right marketing & seo software")
    expect(guide?.readingTime).toBeLessThan(8)
  })

  it("normalizes malformed numeric price ranges", () => {
    const page = getBest("best-marketing-software")
    expect(page?.picks[0]?.priceRange).toBe("$119.95–$499.95/month")
    expect(page?.description).not.toContain("1199549995")
    expect(page?.description).toContain("SEO")
  })

  it("does not invent a missing monthly price", () => {
    const page = getBest("best-email-marketing-ecommerce")
    expect(page?.picks[0]?.priceRange).toBe("Pricing not verified — check the vendor's current pricing")
    expect(page?.picks[0]?.bestFor).not.toContain("+/month")
    expect(page?.pricingSummary).not.toContain("+/month")
  })
  it("replaces generic marketing attribution filler with actionable validation steps", () => {
    const guide = getGuide("marketing-attribution-guide")
    expect(guide).not.toBeNull()
    const body = guide?.sections.map((section) => section.body).join(" ") ?? ""
    const words = body.split(/\s+/).filter(Boolean).length
    expect(words).toBeGreaterThanOrEqual(650)
    expect(body).toContain("cross-device journeys")
    expect(body).toContain("double-counted conversions")
    expect(body).not.toContain("Most successful deployments follow a phased approach")
  })

  it("uses clear guide metadata without repetitive SEO title stuffing", () => {
    const guide = getGuide("marketing-attribution-guide")
    expect(guide?.title).toBe("Marketing Attribution: Practical Marketing & SEO Guide")
    expect(guide?.description).toContain("evaluation criteria")
  })

})
