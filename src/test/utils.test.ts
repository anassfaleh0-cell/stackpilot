import { describe, it, expect } from "vitest"
import { formatDate, cn } from "@/lib/utils"

describe("formatDate", () => {
  it("formats an ISO date string correctly", () => {
    const result = formatDate("2026-07-10")
    expect(result).toBe("July 10, 2026")
  })

  it("handles different months", () => {
    expect(formatDate("2026-01-05")).toBe("January 5, 2026")
    expect(formatDate("2026-12-25")).toBe("December 25, 2026")
  })
})

describe("cn", () => {
  it("joins class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar")
  })

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "visible")
    expect(result).toBe("base visible")
  })

  it("returns empty string for no args", () => {
    expect(cn()).toBe("")
  })
})
