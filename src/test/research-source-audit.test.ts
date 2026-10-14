import { describe, expect, it } from "vitest"
import { getAllResearch, getResearch } from "@/lib/content/registry"

describe("research source provenance", () => {
  it("keeps research URLs useful without presenting unaudited numeric findings as facts", () => {
    const reports = getAllResearch()
    expect(reports.length).toBeGreaterThan(30)

    for (const report of reports) {
      if (report.sourceAuditComplete === true) continue

      expect(report.title).toContain("Research Guide: Metrics and Evidence")
      expect(report.description).toMatch(/withheld until source verification is complete/i)
      expect(report.dataSources).toEqual([])
      expect(report.keyFindings.length).toBeGreaterThanOrEqual(3)
      expect(report.sections.length).toBeGreaterThanOrEqual(3)
      expect(report.methodology).toMatch(/source-provenance review/i)
      expect(report.faqs?.length ?? 0).toBeGreaterThanOrEqual(3)

      for (const section of report.sections) {
        expect(section.body.length).toBeGreaterThan(80)
      }
    }
  })

  it("returns a source-transparent guide for a report with generic source homepages", () => {
    const report = getResearch("saas-churn-benchmarks-2026")
    expect(report).not.toBeNull()
    expect(report?.title).toBe("SaaS Churn Rate Research Guide: Metrics and Evidence")
    expect(report?.dataSources).toEqual([])
    expect(report?.keyFindings.join(" ")).not.toMatch(/\b\d{2,3}%\b/)
  })
})
