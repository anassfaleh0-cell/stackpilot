import { describe, expect, it } from "vitest"
import { getAllComparisons, getAllGuides, getBest, getBlogPost, getComparison, getGuide, getReview } from "@/lib/content/registry"

describe("content quality repairs", () => {
  it("replaces repetitive generated guide filler with practical buyer guidance", () => {
    const guide = getGuide("marketing-attribution-guide")
    expect(guide).not.toBeNull()
    expect(guide?.sections[0]?.title).toBe("Start With the Decision, Not the Dashboard")
    expect(guide?.description).toContain("A practical framework for defining conversions")
    expect(guide?.relatedTools?.length).toBeGreaterThan(0)
    expect(guide?.description).not.toContain("Choosing the right marketing & seo software")
    expect(guide?.readingTime).toBeLessThan(8)
  })

  it("derives guide reading time from normalized rendered content for every guide", () => {
    const guides = getAllGuides()
    expect(guides.length).toBeGreaterThan(0)
    for (const guide of guides) {
      const renderedText = [
        guide.title,
        guide.description,
        ...guide.sections.flatMap((section) => [section.title, section.body, ...(section.items || [])]),
        ...(guide.faqs || []).flatMap((faq) => [faq.question, faq.answer]),
      ].join(" ").replace(/<[^>]*>/g, " ")
      const words = renderedText.split(/\s+/).filter(Boolean).length
      expect(guide.readingTime, guide.slug).toBe(Math.max(3, Math.ceil(words / 200)))
    }
    expect(getGuide("accounting-software-pricing")?.readingTime).toBeGreaterThan(10)
  })

  it("filters known generic filler from normalized review and best-list content", () => {
    const review = getReview("activecampaign")
    const best = getBest("best-crm-for-enterprise")
    expect(JSON.stringify(review)).not.toMatch(/delivers reliable performance with 99\.9% uptime SLA/i)
    expect(JSON.stringify(best)).not.toMatch(/perfect for freelancers and independent professionals/i)
  })

  it("removes malformed nested anchors from imported review content", () => {
    const review = getReview("activecampaign")
    expect(review).not.toBeNull()
    const renderedContent = JSON.stringify(review)
    expect(renderedContent).not.toMatch(/<a\b[^>]*>[\s\S]*?<a\b/i)
    expect((renderedContent.match(/<a\b/gi) || []).length).toBe(
      (renderedContent.match(/<\/a\s*>/gi) || []).length,
    )
  })

  it("explains when compared products belong to different categories", () => {
    const comparison = getAllComparisons().find((candidate) => {
      const left = getReview(candidate.tool1Slug)
      const right = getReview(candidate.tool2Slug)
      if (!left || !right) return false
      const key = (value: string) => value.toLowerCase().replace(/&/g, " ").replace(/[^a-z0-9]+/g, " ").trim()
      return key(left.category) !== key(right.category)
    })
    expect(comparison).toBeDefined()
    const normalized = getComparison(comparison!.slug)
    expect(normalized?.verdict).toContain("These products may address different needs")
  })

  it("does not publish unverified comparison winners or ratings", () => {
    const comparison = getComparison("circleci-vs-containerd")
    expect(comparison).not.toBeNull()
    expect(comparison?.winnerVerified).not.toBe(true)
    expect(comparison?.featuresVerified).not.toBe(true)
    expect(comparison?.winner).toBeNull()
    expect(comparison?.description).not.toMatch(/CircleCI is our overall pick|recorded pick/i)
    expect(comparison?.description).not.toMatch(/[$€£]\s?\d|\b\d+(?:\.\d+)?\s*\/\s*5\b/i)
    expect(comparison?.verdict).toContain("does not name one overall pick")
    expect(comparison?.verdict).toContain("no independently verified rating")
    expect(comparison?.verdict).not.toMatch(/marked available in the dataset|marked unavailable in the dataset/i)
  })

  it("normalizes malformed numeric price ranges", () => {
    const page = getBest("best-marketing-software")
    expect(page?.picks[0]?.priceRange).toBe("Not independently verified — check current vendor pricing")
    expect(page?.description).not.toContain("1199549995")
    expect(page?.description).toContain("SEO")
  })

  it("does not invent a missing monthly price", () => {
    const page = getBest("best-email-marketing-ecommerce")
    expect(page?.picks[0]?.priceRange).toBe("Not independently verified — check current vendor pricing")
    expect(page?.picks[0]?.bestFor).not.toContain("+/month")
    expect(page?.pricingSummary).not.toContain("+/month")
    expect(JSON.stringify(page?.faqs)).not.toContain("+/month")
    expect(JSON.stringify(page?.faqs)).not.toContain("30-40x")
    expect(page?.picks.every((pick) => pick.priceRange === "Not independently verified — check current vendor pricing")).toBe(true)
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
    expect(guide?.title).toBe("Marketing Attribution: A Practical Guide to Choosing and Validating a Model")
    expect(guide?.description).toContain("evaluation criteria")
  })

  it("adds ROI-specific decision guidance instead of repeated generic blog filler", () => {
    const post = getBlogPost("marketing-automation-roi")
    expect(post).not.toBeNull()
    expect(post?.body).toContain("Set a baseline before estimating returns")
    expect(post?.body).toContain("Treat payback as a hypothesis to test")
    expect(post?.body).not.toContain("This topic is most useful when it is connected to a real decision")
  })

  it("does not publish unsupported evaluation claims in review or best-list descriptions", () => {
    const best = getBest("best-marketing-software")
    const review = getReview("asana")
    expect(best?.description).not.toMatch(/we evaluated|hands-on testing|thousands of user reviews/i)
    expect(review?.description).not.toMatch(/we evaluated|hands-on testing|thousands of user reviews/i)
  })

  it("adds product-specific evaluation guidance to a thin review profile", () => {
    const review = getReview("clickup")
    expect(review).not.toBeNull()
    const body = review?.content.map((section) => section.body + " " + (section.items || []).join(" ")).join(" ") ?? ""
    expect(body.split(/\s+/).filter(Boolean).length).toBeGreaterThanOrEqual(900)
    expect(body).toContain("The recorded integration list includes")
    expect(review?.content.some((section) => section.title === "A practical pilot checklist")).toBe(true)
  })


  it("suppresses unverified ratings, pricing, and review-count claims on audited reviews", () => {
    for (const slug of ["asana", "linear", "monday-com", "hubspot"]) {
      const review = getReview(slug)
      expect(review, slug).not.toBeNull()
      expect(review?.ratingVerified, slug).toBe(false)
      expect(review?.reviewCountVerified, slug).toBe(false)
      expect(review?.priceRangeVerified, slug).toBe(false)
      expect(review?.pricing, slug).toBe("Not independently verified")
      expect(review?.priceRange, slug).toMatch(/not independently verified/i)
      expect(review?.description, slug).toMatch(/not independently verified/i)
      expect(review?.pros, slug).toHaveLength(3)
      expect(review?.cons, slug).toHaveLength(3)
      const content = review?.content.map(section => section.body).join(" ") ?? ""
      expect(`${review?.description} ${JSON.stringify(review?.faqs)}`).toMatch(/not independently verified/i)
      expect(JSON.stringify(review?.faqs)).not.toMatch(/\$\s?\d|\d+\s?\/\s?month|\d+\/5|\d[,.]?\d*%/i)
    }
  })

})
