import { describe, expect, it } from "vitest"
import { getAllHubs, getHub } from "@/lib/content/registry"

describe("business hub content integrity", () => {
  it("keeps hub pages useful without publishing unsupported ratings or vendor claims", () => {
    const hubs = getAllHubs()
    expect(hubs.length).toBeGreaterThanOrEqual(10)
    expect(new Set(hubs.map((hub) => hub.title)).size).toBe(hubs.length)

    for (const hub of hubs) {
      if (hub.contentVerified === true) continue

      expect(hub.title).toContain("Selection Guide")
      expect(hub.description).toMatch(/Verify product-specific claims/i)
      expect(hub.challenges.length).toBeGreaterThanOrEqual(3)
      expect(hub.comparisonMatrix.columns).toEqual(["Selection area", "Product to evaluate", "What to verify"])
      expect(hub.comparisonMatrix.rows.length).toBe(hub.recommendations.length)

      for (const row of hub.comparisonMatrix.rows) {
        expect(row).toHaveLength(3)
        expect(row.join(" ")).not.toMatch(/\b\d(?:\.\d)?\s*\/\s*5\b/)
      }
      for (const recommendation of hub.recommendations) {
        expect(recommendation.bestFor).toMatch(/Consider .* for evaluation/i)
      }
    }
  })

  it("provides a safe healthcare guide without unsupported compliance guarantees", () => {
    const hub = getHub("software-for-healthcare")
    expect(hub).not.toBeNull()
    expect(hub?.title).toBe("Software for Healthcare organizations: Selection Guide")
    expect(hub?.comparisonMatrix.rows.flat().join(" ")).not.toMatch(/HIPAA-compliant platform|AES-256|TLS 1\.2|SOC 2 Type II/i)
  })
})
