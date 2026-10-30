import { describe, expect, it } from "vitest"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { SourceEvidencePanel } from "@/components/content/source-evidence"
import { getComparison, getReview } from "@/lib/content/registry"

describe("dated vendor evidence", () => {
  it("survives registry normalization and renders source links without verifying legacy scores", () => {
    for (const slug of ["linear", "asana", "clickup"]) {
      const review = getReview(slug)!
      expect(review.ratingVerified).not.toBe(true)
      const html = renderToStaticMarkup(<SourceEvidencePanel evidence={review.sourceEvidence} />)
      expect(html).toMatch(/datetime="2026-10-30"/i)
      expect(html).toContain("https://")
      expect(html).toContain("not a hands-on performance test")
      for (const fact of review.sourceEvidence!.facts) {
        expect(new URL(fact.sourceUrl).protocol).toBe("https:")
      }
    }
  })
  it("retains a product-specific Asana/ClickUp decision and evidence", () => {
    const comparison = getComparison("asana-vs-clickup")!
    expect(comparison.verdict).toContain("Choose Asana")
    expect(comparison.verdict).toContain("Choose ClickUp")
    expect(comparison.sourceEvidence?.facts).toHaveLength(2)
    expect(comparison.winnerVerified).not.toBe(true)
  })
})
