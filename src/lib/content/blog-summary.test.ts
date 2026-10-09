import { describe, expect, it } from "vitest"
import { getBlogKeyTakeaways } from "./blog-summary"

describe("getBlogKeyTakeaways", () => {
  it("extracts article-specific prose and strips markdown", () => {
    expect(getBlogKeyTakeaways("## Pricing\n\nCompare the same number of users and billing period across every vendor before making a purchase.\n\n| Plan | Cost |\n|---|---|\n| A | $10 |\n\n**Check renewal terms** before approving an annual contract.")).toEqual([
      "Compare the same number of users and billing period across every vendor before making a purchase.",
      "Check renewal terms before approving an annual contract.",
    ])
  })

  it("skips duplicate, short, heading, and table blocks", () => {
    expect(getBlogKeyTakeaways("Short.\n\n## Heading\n\nThis is a sufficiently long article-specific paragraph that explains a practical decision a reader can make.\n\nThis is a sufficiently long article-specific paragraph that explains a practical decision a reader can make.\n\n| Heading | Value |\n|---|---|")).toEqual([
      "This is a sufficiently long article-specific paragraph that explains a practical decision a reader can make.",
    ])
  })

  it("returns no generic fallback for empty content or invalid limits", () => {
    expect(getBlogKeyTakeaways("   ")).toEqual([])
    expect(getBlogKeyTakeaways("A sufficiently long article-specific paragraph should be displayed only when it is genuinely available. ", 0)).toEqual([])
  })
})
