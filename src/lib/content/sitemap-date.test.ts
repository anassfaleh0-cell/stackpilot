import { describe, expect, it } from "vitest"
import { getSitemapLastModified } from "@/lib/content/sitemap-date"

describe("sitemap modification dates", () => {
  it("returns a valid date when a content timestamp is supplied", () => {
    expect(getSitemapLastModified("2026-10-09T00:00:00.000Z")?.toISOString()).toBe("2026-10-09T00:00:00.000Z")
  })

  it("omits missing, blank, and invalid dates instead of inventing a timestamp", () => {
    expect(getSitemapLastModified(undefined)).toBeUndefined()
    expect(getSitemapLastModified(null)).toBeUndefined()
    expect(getSitemapLastModified("   ")).toBeUndefined()
    expect(getSitemapLastModified("not-a-date")).toBeUndefined()
  })

  it("rejects invalid Date instances and preserves valid Date instances", () => {
    expect(getSitemapLastModified(new Date(Number.NaN))).toBeUndefined()
    const date = new Date("2026-01-15T00:00:00.000Z")
    expect(getSitemapLastModified(date)).toBe(date)
  })
})
