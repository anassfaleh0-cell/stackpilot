import { describe, expect, it } from "vitest"
import {
  getAlternative,
  getBest,
  getBlogPost,
  getComparison,
  getGuide,
  getIndustry,
  getResearch,
  getReview,
  getUseCase,
} from "@/lib/content/registry"

const BANNED_CLAIMS = [
  /hands[- ]on testing/i,
  /tested for at least two weeks/i,
  /based on our testing methodology/i,
  /this review is based on hands[- ]on testing/i,
  /we verify our hands[- ]on testing/i,
  /tested in realistic workflows by our team/i,
  /our expert team evaluated/i,
  /our testing methodology/i,
  /after researching hundreds of/i,
  /our expert buying advice/i,
]

function stringsOf(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value)
  else if (Array.isArray(value)) value.forEach((v) => stringsOf(v, out))
  else if (value && typeof value === "object") {
    Object.values(value as Record<string, unknown>).forEach((v) => stringsOf(v, out))
  }
  return out
}

describe("site-wide content quality gate", () => {
  const cases = [
    ["review/asana", getReview("asana")],
    ["comparison/zoom-vs-webex", getComparison("zoom-vs-webex")],
    ["guide/how-to-choose-crm-software", getGuide("how-to-choose-crm-software")],
    ["alternative/notion", getAlternative("notion-alternatives")],
    ["use-case/best-seo-for-agencies", getUseCase("best-seo-for-agencies")],
    ["industry/healthcare", getIndustry("healthcare")],
    ["research/ai-adoption-report-2026", getResearch("ai-adoption-report-2026")],
    ["best/best-project-management-software", getBest("best-project-management-software")],
    ["blog/software-selection", getBlogPost("ai-implementation-roi-guide")],
  ] as const

  it("does not expose unsupported first-hand or expert-testing claims", () => {
    const offenders: string[] = []
    for (const [label, value] of cases) {
      if (!value) continue
      for (const text of stringsOf(value)) {
        for (const pattern of BANNED_CLAIMS) {
          if (pattern.test(text)) offenders.push(label + " :: " + pattern + " :: " + text.slice(0, 120))
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it("keeps substantive content after sanitization", () => {
    for (const [label, value] of cases) {
      expect(value, label).toBeTruthy()
      const strings = stringsOf(value)
      expect(strings.join(" ").length, label).toBeGreaterThan(800)
    }
  })
})
