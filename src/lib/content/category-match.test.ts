import { describe, expect, it } from "vitest"
import { categoryMatches } from "@/lib/content/category-match"

describe("categoryMatches", () => {
  it("matches legacy E-commerce records to E-commerce & Retail", () => {
    expect(categoryMatches("E-commerce", "E-commerce & Retail")).toBe(true)
    expect(categoryMatches("E-commerce & Retail", "E-commerce")).toBe(true)
  })

  it("matches known legacy Analytics and HR labels", () => {
    expect(categoryMatches("Analytics", "Analytics & Data")).toBe(true)
    expect(categoryMatches("HR & Payroll", "HR & People")).toBe(true)
    expect(categoryMatches("Video Communication", "Communication")).toBe(true)
  })

  it("does not merge unrelated categories or match missing labels", () => {
    expect(categoryMatches("Finance & Accounting", "E-commerce & Retail")).toBe(false)
    expect(categoryMatches(undefined, "E-commerce & Retail")).toBe(false)
    expect(categoryMatches("", "E-commerce & Retail")).toBe(false)
  })
})
