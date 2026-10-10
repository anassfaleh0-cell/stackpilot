import { describe, expect, it } from "vitest"
import { getBlogPost } from "@/lib/content/registry"

describe("blog body structure", () => {
  it("preserves headings, paragraph breaks, and Markdown tables after sanitization", () => {
    const post = getBlogPost("ai-software-cost-comparison-2026")

    expect(post).not.toBeNull()
    expect(post!.body).toContain("\n\n## Quick comparison")
    expect(post!.body).toContain("| Product | Entry point |")
    expect(post!.body.split("\n\n").length).toBeGreaterThan(20)
    expect(post!.body).toContain("The useful comparison is not simply the lowest advertised monthly price")
  })
})
