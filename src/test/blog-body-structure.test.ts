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
  it("keeps pricing freshness claims consistent with dated vendor checks", () => {
    const projectManagement = getBlogPost("project-management-software-pricing")
    const designCosts = getBlogPost("design-software-cost-2026")
    const uiUxCosts = getBlogPost("ui-ux-software-pricing")
    const bestDesign = getBlogPost("best-design-software-2026")

    expect(projectManagement?.body).not.toContain("verified as of July 2026")
    expect(projectManagement?.body).toContain("date checked beside the link")
    expect(designCosts?.updatedAt).toBe("2026-10-21")
    expect(uiUxCosts?.updatedAt).toBe("2026-10-21")
    expect(bestDesign?.updatedAt).toBe("2026-10-21")
    expect(bestDesign?.body).not.toContain("undisputed leader")
    expect(bestDesign?.body).not.toContain("over 100 million monthly active users")
    expect(bestDesign?.body).toContain("checked against [Figma’s official pricing page]")
  })

})
