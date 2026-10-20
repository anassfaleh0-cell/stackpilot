import { describe, expect, it } from "vitest"
import { getAllComparisons, getComparison } from "./registry"

describe("comparison publication safeguards", () => {
  it("does not resolve records marked unpublished as public comparison pages", () => {
    expect(getComparison("square-vs-xero")).toBeNull()
  })

  it("excludes unpublished comparison records from public comparison collections", () => {
    expect(getAllComparisons().some((comparison) => comparison.slug === "square-vs-xero")).toBe(false)
  })
})
