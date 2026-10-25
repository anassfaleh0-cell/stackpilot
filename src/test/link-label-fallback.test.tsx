import { describe, expect, it } from "vitest"
import React from "react"
import { renderToStaticMarkup } from "react-dom/server"
import { RichText } from "@/components/content/rich-text"
import { stripDeadContentLinks } from "@/lib/content/link-guard"
import { getReadableLinkFallbackLabel } from "@/lib/content/link-label"

describe("empty internal-link labels", () => {
  it("derives readable labels from internal route slugs", () => {
    expect(getReadableLinkFallbackLabel("/reviews/notion-vs-confluence")).toBe("Notion vs Confluence")
    expect(getReadableLinkFallbackLabel("/guides/crm_migration_checklist?ref=internal")).toBe("CRM Migration Checklist")
    expect(getReadableLinkFallbackLabel("/")).toBe("Related content")
  })

  it("keeps sentence text readable when stripping a dead link with no label", () => {
    expect(stripDeadContentLinks('Choose <a href="/reviews/not-a-real-review"></a> before buying.'))
      .toBe("Choose Not A Real Review before buying.")
  })

  it("gives live empty-label anchors visible text and an accessible name", () => {
    const html = renderToStaticMarkup(
      React.createElement(RichText, { text: 'Compare <a href="/reviews/linear"></a> before choosing.' })
    )
    expect(html).toContain('href="/reviews/linear"')
    expect(html).toContain(">Linear</a>")
    expect(html).not.toContain('href="/reviews/linear"></a>')
  })

  it("does not replace meaningful labels", () => {
    const source = '<a href="/reviews/linear">Read the Linear review</a>'
    expect(stripDeadContentLinks(source)).toBe(source)
  })
})
