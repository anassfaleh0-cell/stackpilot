import { describe, expect, it } from "vitest"
import { getAllStatistics, getStatistic } from "@/lib/content/registry"

describe("statistics source provenance", () => {
  it("keeps category pages available as useful guides while withholding unaudited figures", () => {
    const records = getAllStatistics()
    expect(records.length).toBeGreaterThan(100)
    expect(new Set(records.map((record) => record.title)).size).toBe(records.length)

    for (const record of records) {
      if (record.sourceAuditComplete === true) continue

      expect(record.title).toContain("Market Research Guide")
      expect(record.description).toMatch(/withheld until each claim has a checkable source/i)
      expect(record.stats).toEqual([])
      expect(record.sections.length).toBeGreaterThanOrEqual(3)

      for (const section of record.sections) {
        expect(section.stats).toEqual([])
        expect(section.body?.length ?? 0).toBeGreaterThan(80)
      }
    }
  })

  it("returns a useful category-specific guide for records without source verification", () => {
    const marketing = getStatistic("marketing-software")
    expect(marketing).not.toBeNull()
    expect(marketing?.title).toBe("Marketing Software Market Research Guide")
    expect(marketing?.sections.some((section) => /marketing software/i.test(section.title))).toBe(true)
    expect(marketing?.stats).toEqual([])
  })
})
