import { describe, expect, it } from "vitest"
import { getPagination, getPaginationRange, parsePageParam } from "@/lib/pagination"

describe("listing pagination", () => {
  it("clamps requested pages and calculates visible item ranges", () => {
    expect(getPagination({ page: 1, perPage: 24, total: 928 })).toMatchObject({
      page: 1, totalPages: 39, start: 0, end: 24, hasPrev: false, hasNext: true,
    })
    expect(getPagination({ page: 39, perPage: 24, total: 928 })).toMatchObject({
      page: 39, start: 912, end: 928, hasPrev: true, hasNext: false,
    })
    expect(getPagination({ page: 99, perPage: 24, total: 928 }).page).toBe(39)
  })

  it("parses safe positive page numbers and defaults invalid values to page one", () => {
    expect(parsePageParam("2")).toBe(2)
    expect(parsePageParam(["3", "4"])).toBe(3)
    expect(parsePageParam(undefined)).toBe(1)
    expect(parsePageParam("0")).toBe(1)
    expect(parsePageParam("-2")).toBe(1)
    expect(parsePageParam("not-a-page")).toBe(1)
  })

  it("builds a compact page range with ellipses", () => {
    expect(getPaginationRange(20, 39)).toEqual([1, "ellipsis", 18, 19, 20, 21, 22, "ellipsis", 39])
  })
})
