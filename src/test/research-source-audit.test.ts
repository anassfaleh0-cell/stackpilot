import { describe, expect, it } from "vitest"
import { getAllResearch, getResearch } from "@/lib/content/registry"

describe("research source provenance", () => {
  it("publishes evidence-aware research guides only when sources and limitations are explicit", () => {
    const reports = getAllResearch()
    expect(reports.length).toBeGreaterThan(30)
    expect(new Set(reports.map((record) => record.title)).size).toBe(reports.length)

    for (const report of reports) {
      expect(report.sourceAuditComplete).toBe(true)
      expect(report.dataSources.length).toBeGreaterThan(0)
      expect(report.keyFindings.length).toBeGreaterThanOrEqual(3)
      expect(report.sections.length).toBeGreaterThanOrEqual(3)
      expect(report.methodology.length).toBeGreaterThan(80)

      for (const source of report.dataSources) {
        const url = new URL(source.url)
        expect(url.protocol).toBe("https:")
        expect(url.pathname.split("/").filter(Boolean).length).toBeGreaterThanOrEqual(2)
        expect(source.context).toBeTruthy()
      }

      const editorialText = [
        report.title,
        report.description,
        ...report.keyFindings,
        ...report.sections.flatMap((section) => [section.title, section.body]),
        report.methodology,
      ].join(" ")
      expect(editorialText).not.toMatch(/\b\d{2,3}%\b/)
    }
  })

  it("returns a source-transparent buyer guide for SaaS churn", () => {
    const report = getResearch("saas-churn-benchmarks-2026")
    expect(report).not.toBeNull()
    expect(report?.title).toContain("Evidence Guide and Buyer Checklist")
    expect(report?.sourceAuditComplete).toBe(true)
    expect(report?.dataSources.length).toBeGreaterThan(0)
    expect(report?.keyFindings.join(" ")).not.toMatch(/\b\d{2,3}%\b/)
    expect(report?.sections.some((section) => /churn/i.test(section.body))).toBe(true)
  })
})
