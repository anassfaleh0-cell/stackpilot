import { describe, expect, it } from "vitest"
import fs from "node:fs"
import { getAllStatistics, getStatistic } from "@/lib/content/registry"
import { getNoindexSlugs, hasCompleteStatisticEvidence, isNoindexed } from "@/lib/noindex"
import sitemap from "@/app/sitemap"
import { metadata as directoryMetadata } from "@/app/statistics/page"
import { generateMetadata as statisticMetadata, generateStaticParams } from "@/app/statistics/[slug]/page"

describe("statistics source provenance", () => {
  it("keeps unverifiable datasets out of search without deleting the records", async () => {
    const records = getAllStatistics()
    const blocked = records.filter((record) => isNoindexed("statistics", record.slug))
    expect(blocked.length).toBeGreaterThan(100)
    expect(getNoindexSlugs("statistics")).toHaveLength(blocked.length)
    const indexedPaths = new Set(sitemap().map((entry) => new URL(entry.url).pathname))
    expect(indexedPaths.has("/statistics")).toBe(false)
    expect(directoryMetadata.robots.index).toBe(false)
    for (const record of blocked) {
      expect(indexedPaths.has(`/statistics/${record.slug}`), record.slug).toBe(false)
    }
    const sampleSlug = "dataprivacy-software"
    expect(hasCompleteStatisticEvidence(sampleSlug)).toBe(false)
    expect(generateStaticParams()).toContainEqual({ slug: sampleSlug })
    const meta = await statisticMetadata({ params: Promise.resolve({ slug: sampleSlug }) })
    expect(meta).toMatchObject({ robots: { index: false, follow: true } })
  })

  it("does not emit Dataset rich-result schema until the evidence audit passes", () => {
    const source = fs.readFileSync("src/app/statistics/[slug]/page.tsx", "utf8")
    expect(source).toContain("datasetVerified && (")
    expect(source).toContain("<DatasetSchema")
    expect(source).toContain("getSafeStatisticNarrative(section.title, registry?.category || \"software\", section.body, datasetVerified)")
  })


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
