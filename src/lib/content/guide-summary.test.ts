import { describe, expect, it } from "vitest"
import { getGuideKeyTakeaways } from "@/lib/content/guide-summary"

describe("guide key takeaways", () => {
  it("uses the actual guide section title and summary", () => {
    const takeaways = getGuideKeyTakeaways([
      { title: "Define the conversion", body: "Choose one conversion event and document how it is recorded before comparing attribution models." },
      { title: "Validate the tracking", body: "Compare analytics events with source records and investigate missing or double-counted conversions." },
    ])

    expect(takeaways).toHaveLength(2)
    expect(takeaways[0]).toEqual({
      title: "Define the conversion",
      summary: "Choose one conversion event and document how it is recorded before comparing attribution models.",
    })
    expect(takeaways[1].summary).toContain("double-counted conversions")
  })

  it("limits output and skips empty sections", () => {
    const takeaways = getGuideKeyTakeaways([
      { title: "One", body: "Useful content." },
      { title: " ", body: "Ignored title." },
      { title: "Two", body: "Another useful point." },
      { title: "Three", body: "Third point." },
    ], 2)

    expect(takeaways.map((item) => item.title)).toEqual(["One", "Two"])
    expect(getGuideKeyTakeaways([], 5)).toEqual([])
    expect(getGuideKeyTakeaways([{ title: "No limit", body: "Content." }], 0)).toEqual([])
  })
})
