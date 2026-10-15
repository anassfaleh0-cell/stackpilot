import { describe, expect, it } from "vitest"
import { countByCategory } from "@/lib/category-counts"

describe("published review category counts", () => {
  it("counts actual review records by their category", () => {
    const counts = countByCategory([
      { category: "Project Management" },
      { category: "CRM & Sales" },
      { category: "Project Management" },
    ])

    expect(counts.get("Project Management")).toBe(2)
    expect(counts.get("CRM & Sales")).toBe(1)
    expect(counts.has("Developer Tools")).toBe(false)
  })

  it("returns zero for categories without published review records", () => {
    const counts = countByCategory([])
    expect(counts.get("Developer Tools") ?? 0).toBe(0)
  })
})
