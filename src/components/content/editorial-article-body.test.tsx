import { describe, expect, it } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"
import { EditorialArticleBody } from "./editorial-article-body"

describe("EditorialArticleBody", () => {
  it("renders structured long-form editorial text without duplicating the page H1", () => {
    const html = '<article><h1>Already present above</h1><h2>Test requirements</h2><p>Evaluate the same workflow.</p><ul><li>Test export</li><li>Check permissions</li></ul></article>'
    const result = renderToStaticMarkup(<EditorialArticleBody html={html} />)
    expect(result).toContain("Detailed buyer guide")
    expect(result).toContain("Test requirements")
    expect(result).toContain("Test export")
    expect(result).not.toContain("<h1>")
  })

  it("preserves safe source links and discards executable content and unsafe URLs", () => {
    const html = '<article><p><a href="https://example.com/source">Official source</a> and <a href="javascript:alert(1)">unsafe source</a></p><script>alert("bad")</script></article>'
    const result = renderToStaticMarkup(<EditorialArticleBody html={html} />)
    expect(result).toContain('href="https://example.com/source"')
    expect(result).toContain("unsafe source")
    expect(result).not.toContain("javascript:")
    expect(result).not.toContain('alert("bad")')
  })

  it("does not manufacture text for a missing article body", () => {
    expect(renderToStaticMarkup(<EditorialArticleBody html="" />)).toBe("")
  })
})
