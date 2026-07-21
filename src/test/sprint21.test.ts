import { describe, it, expect } from "vitest"
import { getRelatedByCategory } from "@/lib/content/internal-links"
import { entityGraph } from "@/lib/content/entity-graph"

describe("Sprint 21: Deterministic internal linking", () => {
  it("getRelatedByCategory returns same results on repeated calls", { timeout: 30000 }, () => {
    const result1 = getRelatedByCategory("CRM & Sales", "hubspot")
    const result2 = getRelatedByCategory("CRM & Sales", "hubspot")
    expect(result1).toEqual(result2)
  })

  it("reviews are sorted by rating descending", { timeout: 30000 }, () => {
    const result = getRelatedByCategory("CRM & Sales", "hubspot")
    for (let i = 1; i < result.reviews.length; i++) {
      expect((result.reviews[i - 1].rating ?? 0)).toBeGreaterThanOrEqual(result.reviews[i].rating ?? 0)
    }
  })

  it("guides have deterministic ordering", { timeout: 30000 }, () => {
    const result = getRelatedByCategory("Developer Tools", "")
    const result2 = getRelatedByCategory("Developer Tools", "")
    expect(result.guides.map(g => g.slug)).toEqual(result2.guides.map(g => g.slug))
  })
})

describe("Sprint 21: Entity graph enrichment", () => {
  it("category nodes exist for all 12 canonical categories", () => {
    const expectedSlugs = [
      "ai-ml", "project-management", "crm-sales", "marketing-seo",
      "design-creative", "developer-tools", "analytics-data", "hr-people",
      "finance-accounting", "productivity", "security-compliance", "communication",
    ]
    for (const slug of expectedSlugs) {
      const node = entityGraph.getNode(slug, "category")
      expect(node).toBeDefined()
    }
  })

  it("category nodes have relationships to content in that category", () => {
    const catNode = entityGraph.getNode("crm-sales", "category")
    expect(catNode).toBeDefined()
    expect(catNode!.relationships.length).toBeGreaterThan(0)
    expect(catNode!.relationships[0].relation).toBe("contains")
  })

  it("glossary terms have relationships (non-zero referenced-by)", () => {
    const glossaryTerms = ["crm", "saas", "api", "kpi", "sla"]
    let nonZeroCount = 0
    for (const slug of glossaryTerms) {
      const node = entityGraph.getNode(slug, "glossary")
      if (node && node.relationships.length > 0) nonZeroCount++
    }
    expect(nonZeroCount).toBeGreaterThanOrEqual(5)
  })
})
