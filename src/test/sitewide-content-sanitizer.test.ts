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
  sanitizeUnsupportedClaims,
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
  /\bsub-?\d+(?:\.\d+)?\s*(?:ms|milliseconds?)\b/i,
  /\b\d[\d,]*(?:\.\d+)?\+?\s+(?:users|customers|employees|reviews|templates|integrations|shortcuts|connectors|blocks|content types)\b/i,
  /\b(?:zero|no)\s+(?:loading states?|pagination delays?|downtime)\b/i,
  /\b\d{1,3}(?:\.\d+)?%?\s+(?:faster|improvement|uptime)\b/i,
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

  it("removes unsupported precision and scale claims from sentence-level content", () => {
    const samples = [
      "The product responds in sub-100ms under normal load.",
      "The vendor supports 10,000+ integrations for every plan.",
      "The vendor serves over 10,000 customers worldwide.",
      "The plan includes up to 5,000 connectors.",
      "The platform is used by millions of users.",
      "The platform guarantees zero downtime for all customers.",
      "This workflow delivers 40% faster results.",
      "The vendor has 99.9% uptime.",
      "Watchtower monitors 100,000+ known breach databases and alerts users.",
      "Even if 1Password's servers are breached, encrypted vault data remains unreadable.",
    ]
    for (const sample of samples) {
      expect(sanitizeUnsupportedClaims(sample)).toBe("")
    }
    expect(sanitizeUnsupportedClaims("Teams can compare available plans before choosing a workflow."))
      .toContain("compare available plans")
    expect(sanitizeUnsupportedClaims("Compare available plans. The vendor has 99.9% uptime."))
      .toBe("Compare available plans.")
  })

  it("sanitizes unsupported precision and scale claims inside review list items", () => {
    const suspicious = [
      /\bsub-?\d+(?:\.\d+)?\s*(?:ms|milliseconds?)\b/i,
      /\b\d[\d,]*(?:\.\d+)?\+?\s+(?:users|customers|employees|reviews|templates|integrations|shortcuts|connectors|blocks|content types)\b/i,
      /\b(?:over|more than|up to|nearly|almost)\s+\d[\d,]*(?:\.\d+)?\+?\s+(?:users|customers|employees|reviews|templates|integrations|shortcuts|connectors|blocks|content types)\b/i,
      /\b(?:millions|billions) of (?:users|customers|employees|reviews|integrations)\b/i,
      /\b(?:zero|no)\s+(?:loading states?|pagination delays?|downtime)\b/i,
      /\b\d{1,3}(?:\.\d+)?%?\s+(?:faster|improvement|uptime)\b/i,
    ]
    for (const slug of ["linear", "notion", "asana"]) {
      const review = getReview(slug)
      expect(review, slug).toBeTruthy()
      for (const section of review!.content) {
        for (const item of section.items ?? []) {
          for (const pattern of suspicious) expect(item, slug).not.toMatch(pattern)
        }
      }
    }
  })

  it("keeps substantive content after sanitization", () => {
    for (const [label, value] of cases) {
      expect(value, label).toBeTruthy()
      const strings = stringsOf(value)
      expect(strings.join(" ").length, label).toBeGreaterThan(800)
    }
  })
})
