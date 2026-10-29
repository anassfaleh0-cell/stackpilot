import { describe, expect, it } from "vitest"
import guide from "../../../content/best/best-prototyping-tools.json"

describe("prototyping buyer guide editorial integrity", () => {
  it("preserves the original picks and their recorded scores", () => {
    expect(guide.picks.map((pick) => pick.toolName)).toEqual([
      "Figma", "Zeplin", "InVision", "Sketch", "Adobe XD",
    ])
    expect(guide.picks.map((pick) => pick.rating)).toEqual([4.8, 4.3, 4.2, 4.5, 4.2])
  })

  it("does not recommend discontinued InVision services for new projects", () => {
    const invision = guide.picks.find((pick) => pick.toolName === "InVision")
    expect(invision?.bestFor).toMatch(/historical reference only/i)
    expect(invision?.bestFor).toMatch(/December 31, 2024/i)
    expect(guide.body).toContain("InVision (discontinued; historical reference)")
    expect(guide.body).toContain("https://miro.com/blog/future-miro-freehand/")
  })

  it("answers prototyping buyer questions rather than unrelated meeting software FAQs", () => {
    expect(guide.faqs.length).toBeGreaterThanOrEqual(5)
    const faqs = JSON.stringify(guide.faqs)
    expect(faqs).toMatch(/interactive prototype/i)
    expect(faqs).toMatch(/developer handoff/i)
    expect(faqs).not.toMatch(/tasks that need messaging, meetings, task tracking/i)
    expect(faqs).not.toMatch(/meeting or recording features/i)
  })
})
