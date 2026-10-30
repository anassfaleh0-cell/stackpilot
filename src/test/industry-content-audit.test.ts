import { describe, expect, it } from "vitest"
import { getAllIndustries, getIndustry } from "@/lib/content/registry"

describe("industry guide content integrity", () => {
  it("keeps all industry pages useful without unsupported rankings or malformed markup", () => {
    const industries = getAllIndustries()
    expect(industries.length).toBeGreaterThanOrEqual(40)
    expect(new Set(industries.map((industry) => industry.title)).size).toBe(industries.length)

    for (const industry of industries) {
      if (industry.contentVerified === true) continue

      expect(industry.title).toMatch(/software/i)
      expect(industry.title.length).toBeGreaterThan(20)
      expect(industry.description.length).toBeGreaterThan(50)
      expect(industry.industryOverview).not.toMatch(/<[^>]+>/)
      expect(industry.industryOverview).not.toMatch(/\\b\\d+(?:\\.\\d+)?%|\\$\\s?\\d|\\b\\d{2,}\\+?\\s+(?:companies|organizations|vendors|solutions|tools)\\b/i)
      expect(industry.softwareNeeds.length).toBeGreaterThan(0)
      expect(industry.recommendations.length).toBeGreaterThan(0)

      for (const recommendation of industry.recommendations) {
        expect(recommendation.bestFor).not.toMatch(/HIPAA|HITECH|GDPR|FERPA|COPPA|PCI DSS|SOC 2|ISO 27001|AES-256|TLS 1\\.[23]|certified|compliant|top-rated|\b\d+(?:\.\d+)?%|\$\s?\d/i)
      }
      for (const faq of industry.faqs) {
        expect(faq.answer).not.toMatch(/AES-256|TLS 1\.[23]|\b\d+(?:\.\d+)?%|\$\s?\d/i)
      }
    }
  })

  it("replaces malformed healthcare claims with a source-transparent guide", () => {
    const healthcare = getIndustry("healthcare")
    expect(healthcare).not.toBeNull()
    expect(healthcare?.title).toMatch(/Healthcare/)
    expect(healthcare?.industryOverview).not.toMatch(/<[^>]+>/)
    expect(healthcare?.recommendations.some((recommendation) => /HIPAA-compliant platform/i.test(recommendation.bestFor))).toBe(false)
  })
})
